import {
  createAdminSupabaseClient,
  getOrCreatePaymentOrder,
  getPublicPaymentLink,
} from "@repo/supabase";
import { NextResponse } from "next/server";

import {
  getNicepayConfig,
  isUuid,
  toNicepayGoodsName,
} from "../../../../../lib/nicepay";

export const runtime = "nodejs";

type OrderRouteContext = {
  params: Promise<{ publicToken: string }>;
};

export async function POST(_request: Request, context: OrderRouteContext) {
  const { publicToken } = await context.params;

  if (!isUuid(publicToken)) {
    return NextResponse.json(
      { error: "결제 요청을 찾을 수 없습니다." },
      { status: 404 },
    );
  }

  try {
    const client = createAdminSupabaseClient();
    const link = await getPublicPaymentLink(client, publicToken);

    if (!link) {
      return NextResponse.json(
        { error: "결제 요청을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    if (link.status === "paid") {
      return NextResponse.json(
        { error: "이미 결제가 완료된 요청입니다." },
        { status: 409 },
      );
    }

    const order = await getOrCreatePaymentOrder(client, publicToken);

    if (
      !order ||
      order.amount !== link.amount ||
      !["ready", "failed"].includes(order.provider_status)
    ) {
      return NextResponse.json(
        { error: "현재 결제할 수 없는 요청입니다." },
        { status: 409 },
      );
    }

    const config = getNicepayConfig();
    const returnUrl = new URL(
      `/api/payments/nicepay/return?token=${encodeURIComponent(link.public_token)}`,
      config.siteUrl,
    );

    return NextResponse.json(
      {
        amount: link.amount,
        clientId: config.clientKey,
        goodsName: toNicepayGoodsName(link.payment_name),
        method: "card",
        orderId: order.order_id,
        returnUrl: returnUrl.toString(),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "결제 요청을 준비하지 못했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 },
    );
  }
}
