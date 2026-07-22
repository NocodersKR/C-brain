"use server";

import {
  getOrderOptionConfig,
  getOrderQuantityOptions,
} from "../../_content/order";
import type { OrderPaymentSubmitPayload } from "./OrderCustomerInfoStep";

export type OrderPaymentSubmitResult =
  | {
      redirectHref?: string;
      status: "success";
    }
  | {
      failureReason?: string;
      redirectHref?: string;
      status: "failure";
    };

export async function submitOrderPayment(
  payload: OrderPaymentSubmitPayload,
): Promise<OrderPaymentSubmitResult> {
  const optionConfig = getOrderOptionConfig(payload.summary.ids.serviceId);

  if (!optionConfig) {
    return {
      failureReason: "선택한 상품 정보를 찾을 수 없습니다.",
      redirectHref: "/order/fail?reason=invalid-product",
      status: "failure",
    };
  }

  const quantityOptions = getOrderQuantityOptions(
    optionConfig,
    payload.summary.ids.pageId,
    payload.summary.ids.paperId,
  );
  const selectedQuantity = quantityOptions.find(
    (quantity) => quantity.id === payload.summary.ids.quantityId,
  );
  const planningFee = payload.summary.ids.hasPlanning
    ? optionConfig.planningService.fee
    : 0;
  const serverTotalPrice = selectedQuantity
    ? selectedQuantity.total + planningFee
    : null;

  if (
    serverTotalPrice === null ||
    serverTotalPrice !== payload.summary.totalPrice
  ) {
    return {
      failureReason: "선택한 주문 금액을 확인할 수 없습니다.",
      redirectHref: "/order/fail?reason=invalid-price",
      status: "failure",
    };
  }

  void payload.agreements;
  void payload.customer;

  return {
    failureReason: "결제 연동 준비 중입니다.",
    redirectHref: "/order/fail?reason=payment-not-ready",
    status: "failure",
  };
}
