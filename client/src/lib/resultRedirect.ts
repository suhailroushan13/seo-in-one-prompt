import { isPaidStatus } from "./checkout";

type SearchParams = Record<string, string | string[] | undefined>;

function first(params: SearchParams, key: string): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Builds the `/payment/result` URL for a legacy success/failure landing,
 * carrying over whatever the provider appended.
 */
export function buildResultUrl(
  params: SearchParams,
  fallbackStatus: "success" | "failure"
): string {
  const search = new URLSearchParams();
  const orderId = first(params, "order") ?? first(params, "metadata_orderId");
  const paymentId = first(params, "payment_id");
  const email = first(params, "email");
  const providerStatus = first(params, "status");
  const reason = first(params, "reason") ?? first(params, "error");

  if (orderId) search.set("order", orderId);
  if (paymentId) search.set("payment_id", paymentId);
  if (email) search.set("email", email);

  const status = providerStatus
    ? isPaidStatus(providerStatus)
      ? "success"
      : "failure"
    : fallbackStatus;
  search.set("status", status);
  if (status === "failure" && reason) search.set("reason", reason);

  return `/payment/result?${search.toString()}`;
}
