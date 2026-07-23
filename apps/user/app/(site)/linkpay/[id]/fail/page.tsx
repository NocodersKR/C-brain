import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OrderPaymentResult } from "../../../order/OrderPaymentResult";
import { getLinkPayPayment } from "../../../../_content/linkPay";
import { createNoIndexMetadata } from "../../../../_content/seo";

type LinkPayPaymentFailurePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: LinkPayPaymentFailurePageProps): Promise<Metadata> {
  const { id } = await params;
  const payment = getLinkPayPayment(id);

  if (!payment) {
    return createNoIndexMetadata({
      title: "개인 결제 결과를 찾을 수 없습니다 | C-Brain",
    });
  }

  return createNoIndexMetadata({
    path: `/linkpay/${payment.id}/fail`,
    title: `${payment.clientName} 결제 실패 | C-Brain`,
  });
}

export default async function LinkPayPaymentFailurePage({
  params,
}: LinkPayPaymentFailurePageProps) {
  const { id } = await params;
  const payment = getLinkPayPayment(id);

  if (!payment) notFound();

  return (
    <OrderPaymentResult
      contentHeight={true}
      data={{ failureReason: "결제가 정상적으로 완료되지 않았습니다." }}
      failureRetryHref={`/linkpay/${payment.id}`}
      failureRetryLabel="다시 결제하기"
      showProgress={false}
      variant="failure"
    />
  );
}
