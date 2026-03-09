"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * When Dodo (or another payment provider) redirects to e.g. /?payment_id=...&status=succeeded&email=...,
 * redirect to the custom payment result page so the user sees success/failure UI.
 */
export function PaymentRedirectHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/payment/result") return;

    const status = searchParams.get("status");
    const paymentId = searchParams.get("payment_id");
    const email = searchParams.get("email");
    const name = searchParams.get("name");
    const amount = searchParams.get("amount");
    const reason = searchParams.get("reason") || searchParams.get("error");

    const hasPaymentParams = status != null || paymentId != null;
    if (!hasPaymentParams) return;

    const succeeded = /^(succeeded|success|paid|completed)$/i.test(status ?? "");
    const resultStatus = succeeded ? "success" : "failure";

    const params = new URLSearchParams();
    params.set("status", resultStatus);
    if (email) params.set("email", email);
    if (paymentId) params.set("payment_id", paymentId);
    if (name) params.set("name", name);
    if (amount) params.set("amount", amount);
    if (!succeeded && reason) params.set("reason", reason);

    router.replace(`/payment/result?${params.toString()}`);
  }, [pathname, searchParams, router]);

  return null;
}
