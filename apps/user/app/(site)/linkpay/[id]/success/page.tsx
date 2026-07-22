import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { OrderPaymentResult } from "../../../order/OrderPaymentResult";
import { getLinkPayPayment } from "../../../../_content/linkPay";

type LinkPayPaymentSuccessPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: LinkPayPaymentSuccessPageProps): Promise<Metadata> {
  const { id } = await params;
  const payment = getLinkPayPayment(id);

  if (!payment) {
    return { title: "개인 결제 결과를 찾을 수 없습니다 | 씨브레인" };
  }

  return {
    title: `${payment.clientName} 결제 완료 | 씨브레인`,
  };
}

export default async function LinkPayPaymentSuccessPage({
  params,
}: LinkPayPaymentSuccessPageProps) {
  const { id } = await params;
  const payment = getLinkPayPayment(id);

  if (!payment) notFound();
  if (payment.status !== "paid") redirect(`/linkpay/${payment.id}`);

  return (
    <OrderPaymentResult
      data={{
        companyName: payment.clientName,
        detailRows: payment.detailRows,
        paymentMethod: "카드",
        totalPrice: payment.amount,
      }}
      showProgress={false}
      successPrimaryHref="/order"
      successPrimaryLabel="다른 제품 주문하기"
      variant="success"
    />
  );
}
