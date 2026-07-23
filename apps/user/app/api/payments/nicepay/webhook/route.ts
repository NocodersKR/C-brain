import {
  completePaymentOrder,
  createAdminSupabaseClient,
  getPaymentOrderByOrderId,
  updatePaymentOrder,
} from "@repo/supabase";

import {
  getNicepayConfig,
  parseNicepayPayment,
  retrieveNicepayPayment,
  verifyNicepayPayment,
  type NicepayPayment,
} from "../../../../../lib/nicepay";

export const runtime = "nodejs";

const acknowledge = () =>
  new Response("OK", {
    headers: { "Content-Type": "text/html; charset=utf-8" },
    status: 200,
  });

function toProviderTimestamp(value: string | null) {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function toRecordedTimestamp(value: string | null) {
  return toProviderTimestamp(value) ?? new Date().toISOString();
}

export async function POST(request: Request) {
  const config = getNicepayConfig();
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON.", { status: 400 });
  }

  const payment = parseNicepayPayment(body);

  if (
    !payment ||
    !verifyNicepayPayment(
      payment,
      {
        amount: payment.amount,
        orderId: payment.orderId,
        tid: payment.tid,
      },
      config.secretKey,
    )
  ) {
    return new Response("Invalid signature.", { status: 400 });
  }

  const client = createAdminSupabaseClient();
  const order = await getPaymentOrderByOrderId(client, payment.orderId);

  // NICEPAY's webhook test may use an order that does not exist locally.
  if (!order) return acknowledge();

  if (
    payment.amount !== order.amount ||
    (order.nicepay_tid !== null && order.nicepay_tid !== payment.tid)
  ) {
    return new Response("Payment mismatch.", { status: 400 });
  }

  let trustedPayment: NicepayPayment = payment;

  if (order.nicepay_tid === null) {
    try {
      const retrievedPayment = await retrieveNicepayPayment(
        config,
        payment.tid,
      );

      if (!retrievedPayment) {
        return new Response("Payment lookup failed.", { status: 503 });
      }
      trustedPayment = retrievedPayment;
    } catch {
      return new Response("Payment lookup failed.", { status: 503 });
    }
  }

  if (
    !verifyNicepayPayment(
      trustedPayment,
      {
        amount: order.amount,
        orderId: order.order_id,
        tid: payment.tid,
      },
      config.secretKey,
    )
  ) {
    return new Response("Payment verification failed.", { status: 400 });
  }

  if (
    trustedPayment.status === "paid" &&
    trustedPayment.resultCode !== "0000"
  ) {
    return new Response("Invalid paid result.", { status: 400 });
  }

  try {
    if (trustedPayment.status === "paid") {
      const paidAt = toProviderTimestamp(trustedPayment.paidAt);

      if (!paidAt) {
        return new Response("Invalid paid timestamp.", { status: 400 });
      }

      await completePaymentOrder(client, {
        amount: order.amount,
        nicepayTid: trustedPayment.tid,
        orderId: order.order_id,
        paidAt,
        payMethod: trustedPayment.payMethod,
        receiptUrl: trustedPayment.receiptUrl,
        resultCode: trustedPayment.resultCode,
        resultMessage: trustedPayment.resultMsg,
      });
    } else {
      await updatePaymentOrder(client, order.order_id, {
        cancelled_at:
          trustedPayment.status === "cancelled" ||
          trustedPayment.status === "partialCancelled"
            ? toRecordedTimestamp(trustedPayment.cancelledAt)
            : null,
        nicepay_tid: trustedPayment.tid,
        provider_status: trustedPayment.status,
        result_code: trustedPayment.resultCode,
        result_message: trustedPayment.resultMsg,
      });
    }
  } catch {
    return new Response("Payment persistence failed.", { status: 500 });
  }

  return acknowledge();
}
