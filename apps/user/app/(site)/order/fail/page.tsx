import type { Metadata } from "next";

import { OrderPaymentResult } from "../OrderPaymentResult";

export const metadata: Metadata = {
  title: "결제 실패 | 씨브레인",
};

export default function OrderPaymentFailPage() {
  return <OrderPaymentResult variant="failure" />;
}
