import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Unsuccessful",
  description: "Your payment could not be completed. Please try again.",
  robots: { index: false, follow: false },
};

export default function FailureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
