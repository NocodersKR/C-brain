import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createNoIndexMetadata } from "../../../_content/seo";

export const metadata: Metadata = createNoIndexMetadata({
  path: "/order/success",
  title: "결제 완료 | C-Brain",
});

export default function OrderPaymentSuccessPage() {
  redirect("/order");
}
