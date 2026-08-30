import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isPaidStatus } from "@/lib/checkout";

/** Params a checkout provider appends when it lands on the wrong route. */
const PAYMENT_PARAMS = ["status", "payment_id", "order", "metadata_orderId"] as const;

/**
 * Some checkout links can only be configured with a bare domain, so the buyer
 * comes back to `/?status=…&payment_id=…`. Forward those to the result page
 * before the home page renders, carrying only what the provider actually sent:
 * a missing `status` is unknown, not a failure, and the result page resolves
 * the true state from the order record.
 */
export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  if (pathname !== "/") return NextResponse.next();
  if (!PAYMENT_PARAMS.some((key) => searchParams.has(key))) {
    return NextResponse.next();
  }

  const params = new URLSearchParams();
  const orderId = searchParams.get("order") ?? searchParams.get("metadata_orderId");
  const paymentId = searchParams.get("payment_id");
  const email = searchParams.get("email");
  const status = searchParams.get("status");
  const reason = searchParams.get("reason") ?? searchParams.get("error");

  if (orderId) params.set("order", orderId);
  if (paymentId) params.set("payment_id", paymentId);
  if (email) params.set("email", email);
  if (status) {
    const paid = isPaidStatus(status);
    params.set("status", paid ? "success" : "failure");
    if (!paid && reason) params.set("reason", reason);
  }

  return NextResponse.redirect(
    new URL(`/payment/result?${params.toString()}`, request.url)
  );
}

export const config = {
  matcher: "/",
};
