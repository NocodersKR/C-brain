import type { Metadata } from "next";
import "./globals.css";
import "../../../design-system.css";

export const metadata: Metadata = {
  title: "C-Brain Admin",
  description: "C-Brain admin app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
