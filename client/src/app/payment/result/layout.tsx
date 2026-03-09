import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Result",
  description: "View the status of your payment for SEO Prompt Generator.",
  robots: { index: false, follow: false },
};

export default function PaymentResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
