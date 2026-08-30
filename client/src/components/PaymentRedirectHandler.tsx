"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { isPaidStatus } from "@/lib/checkout";

/**
 * Payment providers redirect back to whatever URL they were configured with —
 * often the site root, e.g. `/?payment_id=...&status=succeeded&order=ord_...`.
 * Forward any such landing to the receipt page with the parameters intact.
 */
export function PaymentRedirectHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/payment/result") return;

    const orderId = searchParams.get("order") ?? searchParams.get("metadata_orderId");
    const status = searchParams.get("status");
    const paymentId = searchParams.get("payment_id");
    const email = searchParams.get("email");
    const reason = searchParams.get("reason") ?? searchParams.get("error");

    if (!status && !paymentId && !orderId) return;

    const params = new URLSearchParams();
    if (orderId) params.set("order", orderId);
    if (paymentId) params.set("payment_id", paymentId);
    if (email) params.set("email", email);
    // Only assert an outcome the provider actually reported; otherwise the
    // receipt page resolves the real status from the server.
    if (status) params.set("status", isPaidStatus(status) ? "success" : "failure");
    if (reason && !isPaidStatus(status)) params.set("reason", reason);

    router.replace(`/payment/result?${params.toString()}`);
  }, [pathname, searchParams, router]);

  return null;
}
