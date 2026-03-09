"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight } from "lucide-react";

const FAILURE_MESSAGES: Record<string, string> = {
    cancelled: "You cancelled the payment.",
    payment_failed: "The payment could not be completed.",
    declined: "Your payment was declined.",
    expired: "The payment session expired.",
};

function FailureContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") ?? searchParams.get("error") ?? "payment_failed";
  const message = FAILURE_MESSAGES[reason] ?? "Something went wrong. Please try again.";

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
        <AlertCircle className="h-7 w-7" aria-hidden />
      </div>
      <h1 className="text-3xl font-bold tracking-tight">Payment unsuccessful</h1>
      <p className="mt-4 text-muted-foreground">{message}</p>
      <Link
        href="/generate"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        Try again
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
      <Link
        href="/"
        className="mt-4 block text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        Back to home
      </Link>
    </div>
  );
}

export default function FailurePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-24 text-center text-muted-foreground">Loading…</div>}>
      <FailureContent />
    </Suspense>
  );
}
