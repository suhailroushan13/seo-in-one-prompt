import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Success — Check Your Email",
  description: "Your SEO prompt has been sent to your email. Check your inbox.",
  robots: { index: false, follow: false },
};

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
