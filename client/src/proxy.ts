import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * When payment provider redirects to /?status=...&payment_id=...&email=...,
 * redirect to /payment/result immediately so the user never sees the home page.
 */
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname !== "/") {
    return NextResponse.next();
  }
  const status = request.nextUrl.searchParams.get("status");
  const paymentId = request.nextUrl.searchParams.get("payment_id");
  const hasPaymentParams = status != null || paymentId != null;
  if (!hasPaymentParams) {
    return NextResponse.next();
  }
  const succeeded = /^(succeeded|success|paid|completed)$/i.test(status ?? "");
  const resultStatus = succeeded ? "success" : "failure";
  const params = new URLSearchParams(request.nextUrl.searchParams);
  params.set("status", resultStatus);
  return NextResponse.redirect(new URL(`/payment/result?${params.toString()}`, request.url));
}

export const config = {
  matcher: "/",
};
