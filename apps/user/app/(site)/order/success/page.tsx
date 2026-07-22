import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "결제 완료 | 씨브레인",
};

export default function OrderPaymentSuccessPage() {
  redirect("/order");
}
