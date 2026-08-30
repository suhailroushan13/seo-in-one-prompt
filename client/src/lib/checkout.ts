import { CHECKOUT_URL, SITE_URL } from "./product";

export interface CheckoutParams {
  orderId: string;
  email: string;
  fullName?: string;
}

/**
 * Builds the hosted-checkout URL.
 *
 * `redirect_url` carries our order id back, so the result page can resolve the
 * order even when the provider does not echo the customer email. Provider
 * params (status, payment_id, …) are appended by the provider on return.
 */
export function buildCheckoutUrl({
  orderId,
  email,
  fullName,
}: CheckoutParams): string {
  const url = new URL(CHECKOUT_URL);
  url.searchParams.set(
    "redirect_url",
    `${SITE_URL}/payment/result?order=${encodeURIComponent(orderId)}`
  );
  url.searchParams.set("metadata_orderId", orderId);
  if (email) url.searchParams.set("email", email);
  if (fullName) url.searchParams.set("fullName", fullName);
  return url.toString();
}

/** Provider status strings that mean "money received". */
export function isPaidStatus(status: string | null | undefined): boolean {
  return /^(success|succeeded|paid|completed|active)$/i.test(
    (status ?? "").trim()
  );
}
