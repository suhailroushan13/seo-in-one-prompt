import type { Metadata } from "next";
import { PricingCard } from "@/components/home/PricingCard";
import { Faq } from "@/components/home/Faq";
import { formatPrice } from "@/lib/product";

const description = `One SEO implementation prompt for ${formatPrice()}. One-time payment, no account, no subscription. Delivered as a PDF and a Markdown file.`;

export const metadata: Metadata = {
  title: "Pricing",
  description,
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing | SEO Prompt Generator",
    description,
    url: "/pricing",
  },
};

export default function PricingPage() {
  return (
    <>
      <PricingCard id="pricing" />
      <Faq />
    </>
  );
}
