"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, ArrowRight } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-500/15 text-green-600 dark:text-green-400">
        <Mail className="h-7 w-7" aria-hidden />
      </div>
      <h1 className="text-3xl font-bold tracking-tight">Check your email</h1>
      <p className="mt-4 text-muted-foreground">
        We&apos;ve sent you the prompt.
        {email && (
          <span className="mt-2 block text-sm">
            Sent to <strong className="text-foreground">{email}</strong>
          </span>
        )}
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        Back to Generator
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-24 text-center text-muted-foreground">Loading…</div>}>
      <SuccessContent />
    </Suspense>
  );
}
