import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getLinkPayPayment } from "../../../_content/linkPay";
import { LinkPayPaymentForm } from "./LinkPayPaymentForm";

type LinkPayPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: LinkPayPageProps): Promise<Metadata> {
  const { id } = await params;
  const payment = getLinkPayPayment(id);

  if (!payment) {
    return { title: "개인 결제창을 찾을 수 없습니다 | 씨브레인" };
  }

  return {
    title: `${payment.clientName} 개인 결제 | 씨브레인`,
    description: `${payment.clientName}의 ${payment.paymentName} 카드 결제 페이지입니다.`,
  };
}

export default async function LinkPayPage({ params }: LinkPayPageProps) {
  const { id } = await params;
  const payment = getLinkPayPayment(id);

  if (!payment) notFound();

  return <LinkPayPaymentForm payment={payment} />;
}
