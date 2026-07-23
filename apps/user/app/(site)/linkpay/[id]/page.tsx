import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { getLinkPayPayment } from "../../../_content/linkPay";
import { createNoIndexMetadata } from "../../../_content/seo";
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
    return createNoIndexMetadata({
      title: "개인 결제창을 찾을 수 없습니다 | C-Brain",
    });
  }

  return createNoIndexMetadata({
    description: `${payment.clientName}의 ${payment.paymentName} 카드 결제 페이지입니다.`,
    path: `/linkpay/${payment.id}`,
    title: `${payment.clientName} 개인 결제 | C-Brain`,
  });
}

export default async function LinkPayPage({ params }: LinkPayPageProps) {
  const { id } = await params;
  const payment = getLinkPayPayment(id);

  if (!payment) notFound();
  if (payment.status !== "pending") redirect(`/linkpay/${payment.id}/success`);

  return <LinkPayPaymentForm payment={payment} />;
}
