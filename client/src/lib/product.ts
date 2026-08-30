/** Single source of truth for product identity, price, and checkout destination. */

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "SEO Prompt Generator";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://seopromptai.com"
).replace(/\/+$/, "");

/** Checkout destination. Override per-environment with NEXT_PUBLIC_CHECKOUT_URL. */
export const CHECKOUT_URL =
  process.env.NEXT_PUBLIC_CHECKOUT_URL || "https://dodo.pe/seopromptai";

const parsedPrice = Number(process.env.NEXT_PUBLIC_PRICE_AMOUNT);

export const PRICE = {
  amount: Number.isFinite(parsedPrice) && parsedPrice > 0 ? parsedPrice : 9,
  currency: process.env.NEXT_PUBLIC_PRICE_CURRENCY || "USD",
} as const;

export function formatPrice(
  amount: number = PRICE.amount,
  currency: string = PRICE.currency
): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

/** What the buyer receives — rendered on the landing page, checkout card, and delivery page. */
export const DELIVERABLES = [
  "Full SEO implementation prompt (10 sections)",
  "Keyword map, clusters, and URL structure",
  "Meta tags, Open Graph, and JSON-LD schema plan",
  "Technical SEO: sitemap, robots, rendering strategy",
  "Core Web Vitals performance targets",
  "PDF, Markdown, and plain-text copies",
] as const;
