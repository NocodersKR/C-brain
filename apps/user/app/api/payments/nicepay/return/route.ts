import {
  completePaymentOrder,
  createAdminSupabaseClient,
  getPaymentOrderByLinkId,
  getPublicPaymentLink,
  updatePaymentOrder,
  type CBrainSupabaseClient,
} from "@repo/supabase";

import {
  approveNicepayPayment,
  getNicepayConfig,
  isUuid,
  netCancelNicepayPayment,
  parseNicepayAuthCallback,
  retrieveNicepayPayment,
  verifyNicepayAuthCallback,
  verifyNicepayPayment,
  type NicepayConfig,
  type NicepayPayment,
} from "../../../../../lib/nicepay";

export const runtime = "nodejs";

type ResultState = "failed" | "pending" | "success";

function resultRedirect(
  config: NicepayConfig,
  publicToken: string,
  result: ResultState,
) {
  const location = new URL(`/linkpay/${publicToken}/result`, config.siteUrl);
  location.searchParams.set("result", result);

  return new Response(null, {
    headers: {
      "Cache-Control": "no-store",
      Location: location.toString(),
    },
    status: 303,
  });
}

function toProviderTimestamp(value: string | null) {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function toRecordedTimestamp(value: string | null) {
  return toProviderTimestamp(value) ?? new Date().toISOString();
}

function isAuthenticPayment(
  payment: NicepayPayment | null,
  expected: { amount: number; orderId: string; tid: string },
  config: NicepayConfig,
): payment is NicepayPayment {
  return Boolean(
    payment && verifyNicepayPayment(payment, expected, config.secretKey),
  );
}

async function saveFailedAttempt(
  client: CBrainSupabaseClient,
  orderId: string,
  resultCode: string,
  resultMessage: string,
) {
  try {
    await updatePaymentOrder(client, orderId, {
      provider_status: "failed",
      result_code: resultCode.slice(0, 64),
      result_message: resultMessage.slice(0, 500),
    });
  } catch {
    // A concurrent signed webhook may already have completed the order.
  }
}

async function saveProviderState(
  client: CBrainSupabaseClient,
  payment: NicepayPayment,
) {
  if (payment.status === "paid") return;

  try {
    await updatePaymentOrder(client, payment.orderId, {
      cancelled_at:
        payment.status === "cancelled" || payment.status === "partialCancelled"
          ? toRecordedTimestamp(payment.cancelledAt)
          : null,
      nicepay_tid: payment.tid,
      provider_status: payment.status,
      result_code: payment.resultCode,
      result_message: payment.resultMsg,
    });
  } catch {
    // Keep the more authoritative state written by a concurrent callback/webhook.
  }
}

async function tryNetCancel(
  client: CBrainSupabaseClient,
  config: NicepayConfig,
  orderId: string,
  amount: number,
) {
  try {
    const payment = await netCancelNicepayPayment(config, orderId);

    if (
      !payment ||
      !["cancelled", "partialCancelled"].includes(payment.status) ||
      !verifyNicepayPayment(
        payment,
        { amount, orderId, tid: payment.tid },
        config.secretKey,
      )
    ) {
      return false;
    }

    await saveProviderState(client, payment);
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  let config: NicepayConfig;

  try {
    config = getNicepayConfig();
  } catch {
    return new Response("Payment configuration error.", { status: 500 });
  }

  const publicToken = new URL(request.url).searchParams.get("token") ?? "";

  if (!isUuid(publicToken)) {
    return new Response("Invalid payment link.", { status: 400 });
  }

  const client = createAdminSupabaseClient();
  const link = await getPublicPaymentLink(client, publicToken);

  if (!link) return new Response("Payment link not found.", { status: 404 });

  const order = await getPaymentOrderByLinkId(client, link.id);

  if (!order) return resultRedirect(config, publicToken, "failed");
  if (order.provider_status === "paid" || link.status === "paid") {
    return resultRedirect(config, publicToken, "success");
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    await saveFailedAttempt(
      client,
      order.order_id,
      "INVALID_FORM",
      "인증 결과 형식이 올바르지 않습니다.",
    );
    return resultRedirect(config, publicToken, "failed");
  }

  const authResultCode = formData.get("authResultCode");

  if (authResultCode !== "0000") {
    await saveFailedAttempt(
      client,
      order.order_id,
      typeof authResultCode === "string" ? authResultCode : "AUTH_FAILED",
      typeof formData.get("authResultMsg") === "string"
        ? String(formData.get("authResultMsg"))
        : "결제 인증에 실패했습니다.",
    );
    return resultRedirect(config, publicToken, "failed");
  }

  const callback = parseNicepayAuthCallback(formData);

  if (
    !callback ||
    !verifyNicepayAuthCallback(
      callback,
      {
        amount: order.amount,
        clientKey: config.clientKey,
        orderId: order.order_id,
      },
      config.secretKey,
    )
  ) {
    await saveFailedAttempt(
      client,
      order.order_id,
      "INVALID_CALLBACK",
      "결제 인증 검증에 실패했습니다.",
    );
    return resultRedirect(config, publicToken, "failed");
  }

  const expectedPayment = {
    amount: order.amount,
    orderId: order.order_id,
    tid: callback.tid,
  };
  let payment: NicepayPayment | null = null;
  let approvalWasUncertain = false;

  try {
    payment = await approveNicepayPayment(config, callback.tid, order.amount);
    approvalWasUncertain = !payment;
  } catch {
    approvalWasUncertain = true;
  }

  if (!isAuthenticPayment(payment, expectedPayment, config)) {
    try {
      const retrievedPayment = await retrieveNicepayPayment(
        config,
        callback.tid,
      );

      if (isAuthenticPayment(retrievedPayment, expectedPayment, config)) {
        payment = retrievedPayment;
      } else {
        approvalWasUncertain = true;
      }
    } catch {
      approvalWasUncertain = true;
    }
  }

  if (!isAuthenticPayment(payment, expectedPayment, config)) {
    const cancelled = await tryNetCancel(
      client,
      config,
      order.order_id,
      order.amount,
    );
    return resultRedirect(
      config,
      publicToken,
      cancelled ? "failed" : "pending",
    );
  }

  if (payment.status === "paid" && payment.resultCode !== "0000") {
    const cancelled = await tryNetCancel(
      client,
      config,
      order.order_id,
      order.amount,
    );
    return resultRedirect(
      config,
      publicToken,
      cancelled ? "failed" : "pending",
    );
  }

  if (payment.status !== "paid") {
    await saveProviderState(client, payment);

    if (approvalWasUncertain && payment.status === "ready") {
      const cancelled = await tryNetCancel(
        client,
        config,
        order.order_id,
        order.amount,
      );
      return resultRedirect(
        config,
        publicToken,
        cancelled ? "failed" : "pending",
      );
    }

    return resultRedirect(
      config,
      publicToken,
      payment.status === "ready" ? "pending" : "failed",
    );
  }

  const paidAt = toProviderTimestamp(payment.paidAt);

  if (!paidAt) {
    const cancelled = await tryNetCancel(
      client,
      config,
      order.order_id,
      order.amount,
    );
    return resultRedirect(
      config,
      publicToken,
      cancelled ? "failed" : "pending",
    );
  }

  try {
    await completePaymentOrder(client, {
      amount: order.amount,
      nicepayTid: payment.tid,
      orderId: order.order_id,
      paidAt,
      payMethod: payment.payMethod,
      receiptUrl: payment.receiptUrl,
      resultCode: payment.resultCode,
      resultMessage: payment.resultMsg,
    });
  } catch {
    const cancelled = await tryNetCancel(
      client,
      config,
      order.order_id,
      order.amount,
    );
    return resultRedirect(
      config,
      publicToken,
      cancelled ? "failed" : "pending",
    );
  }

  return resultRedirect(config, publicToken, "success");
}
