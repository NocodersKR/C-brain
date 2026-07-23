import { createPageMetadata } from "../../_content/seo";

export const metadata = createPageMetadata("order");

export default function OrderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
