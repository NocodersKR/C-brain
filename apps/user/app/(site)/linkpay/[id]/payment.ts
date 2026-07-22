import type { LinkPayPaymentSubmitPayload } from "./LinkPayPaymentForm";

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
  void payload;

  return { status: "success" };
}
