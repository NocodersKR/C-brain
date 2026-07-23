import type { Metadata } from "next";

import { createNoIndexMetadata } from "../../../_content/seo";
import { OrderPaymentResult } from "../OrderPaymentResult";

export const metadata: Metadata = createNoIndexMetadata({
  path: "/order/fail",
  title: "결제 실패 | C-Brain",
});

type OrderPaymentFailPageProps = {
  searchParams?: Promise<{ reason?: string }>;
};

const failureReasonMessages = {
  "invalid-price": "선택한 주문 금액을 확인할 수 없습니다.",
  "invalid-product": "선택한 상품 정보를 찾을 수 없습니다.",
  "payment-not-ready": "결제 연동 준비 중입니다.",
} as const;

export default async function OrderPaymentFailPage({
  searchParams,
}: OrderPaymentFailPageProps) {
  const { reason } = (await searchParams) ?? {};
  const failureReason =
    reason && reason in failureReasonMessages
      ? failureReasonMessages[reason as keyof typeof failureReasonMessages]
      : "결제가 정상적으로 완료되지 않았습니다.";

  return (
    <OrderPaymentResult
      data={{ failureReason }}
      variant="failure"
    />
  );
}
