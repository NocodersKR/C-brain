import type { Metadata } from "next";

import { OrderPaymentResult } from "../OrderPaymentResult";

export const metadata: Metadata = {
  title: "결제 완료 | 씨브레인",
};

export default function OrderPaymentSuccessPage() {
  return <OrderPaymentResult variant="success" />;
}
