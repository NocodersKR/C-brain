"use server";

import { getLinkPayPayment } from "../../../_content/linkPay";

export type LinkPayAgreementId = "privacyCollection" | "privacyPolicy";

export type LinkPayCustomerInfo = {
  customerCompany: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
};

export type LinkPayPaymentSubmitPayload = {
  agreements: Record<LinkPayAgreementId, boolean>;
  customer: LinkPayCustomerInfo;
  linkPayId: string;
};

export type LinkPayPaymentSubmitResult =
  | {
      redirectHref?: string;
      status: "success";
    }
  | {
      failureReason?: string;
      redirectHref?: string;
      status: "failure";
    };

export async function submitLinkPayPayment(
  payload: LinkPayPaymentSubmitPayload,
): Promise<LinkPayPaymentSubmitResult> {
  const payment = getLinkPayPayment(payload.linkPayId);

  if (!payment) {
    return {
      failureReason: "개인 결제 정보를 찾을 수 없습니다.",
      status: "failure",
    };
  }

  if (payment.status !== "pending") {
    return {
      redirectHref: `/linkpay/${payment.id}/success`,
      status: "success",
    };
  }

  void payload.agreements;
  void payload.customer;

  return {
    failureReason: "결제 연동 준비 중입니다.",
    redirectHref: `/linkpay/${payment.id}/fail`,
    status: "failure",
  };
}
