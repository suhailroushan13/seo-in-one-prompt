"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight, Inbox, Check } from "lucide-react";
import { loadPendingPrompt, clearFormAndUserStorage } from "@/lib/formStorage";

const FAILURE_MESSAGES: Record<string, string> = {
  cancelled: "You cancelled the payment.",
  payment_failed: "The payment could not be completed.",
  declined: "Your payment was declined.",
  expired: "The payment session expired.",
};

function formatPaymentTime(date: Date) {
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatAmount(amount: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(amount);
}

/** Returns the webmail inbox URL for the given email, or Gmail as default. */
function getInboxUrl(email: string): string {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  if (domain === "gmail.com" || domain === "googlemail.com")
    return "https://mail.google.com/mail/u/0/#inbox";
  if (["outlook.com", "hotmail.com", "live.com", "msn.com", "hotmail.co.uk", "live.co.uk"].includes(domain))
    return "https://outlook.live.com/mail/0/inbox";
  if (domain.startsWith("yahoo."))
    return "https://mail.yahoo.com/";
  if (["icloud.com", "me.com", "mac.com"].includes(domain))
    return "https://www.icloud.com/mail";
  return "https://mail.google.com/mail/u/0/#inbox";
}

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "failure";
  const isSuccess = /^(success|succeeded|paid|completed)$/i.test(status);
  const completeCalledRef = useRef(false);
  const [paymentTime, setPaymentTime] = useState<Date | null>(null);
  const [storedName, setStoredName] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState<boolean | null>(null);
  const [emailSentReason, setEmailSentReason] = useState<string | null>(null);

  // Record payment + send email: use prompt/name from localStorage (saved when user clicked Submit), or fallback to server pending
  useEffect(() => {
    if (!isSuccess || completeCalledRef.current) return;
    const emailFromUrl = searchParams.get("email")?.trim();
    if (!emailFromUrl) return;
    completeCalledRef.current = true;
    setPaymentTime(new Date());
    const key = emailFromUrl.toLowerCase();
    const pendingFromStorage = loadPendingPrompt();
    const useStorage =
      pendingFromStorage &&
      pendingFromStorage.email === key &&
      pendingFromStorage.prompt?.trim();
    const body = {
      email: key,
      status,
      name: searchParams.get("name")?.trim() || (useStorage ? pendingFromStorage!.fullName : undefined) || undefined,
      payment_id: searchParams.get("payment_id")?.trim() || undefined,
      amount: searchParams.get("amount") ? Number(searchParams.get("amount")) : undefined,
      currency: searchParams.get("currency")?.trim() || "USD",
      ...(useStorage
        ? {
            prompt: pendingFromStorage!.prompt.trim(),
            fullName: pendingFromStorage!.fullName,
            brandName: pendingFromStorage!.brandName ?? "",
          }
        : {}),
    };
    fetch("/api/payment/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.name) setStoredName(data.name);
        if (typeof data?.sent === "boolean") setEmailSent(data.sent);
        if (data?.reason) setEmailSentReason(data.reason);
        if (data?.sent === true) clearFormAndUserStorage();
      })
      .catch(() => setEmailSent(false));
  }, [isSuccess, searchParams, status]);

  if (isSuccess) {
    const email = searchParams.get("email") ?? "";
    const nameFromUrl = searchParams.get("name") ?? "";
    const name = nameFromUrl || (storedName ?? "");
    const amountParam = searchParams.get("amount");
    const amount = amountParam ? Number(amountParam) : undefined;
    const currency = searchParams.get("currency")?.trim() || "USD";
    const displayTime = paymentTime ?? new Date();
    const inboxUrl = getInboxUrl(email);

    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        {/* Verified check animation */}
        <div
          className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 text-green-600 dark:text-green-400 animate-in zoom-in-50 duration-500"
          role="img"
          aria-label="Payment verified"
        >
          <span className="relative flex h-12 w-12 items-center justify-center">
            <span className="absolute inset-0 rounded-full border-4 border-green-500/50 dark:border-green-400/50 animate-ping animation-duration-[1.5s]" />
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-green-500 dark:bg-green-400 text-background">
              <Check className="h-6 w-6 stroke-3" aria-hidden />
            </span>
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight">Payment received</h1>
        <p className="mt-2 text-lg font-medium text-green-600 dark:text-green-400">
          Success
        </p>
        <p className="mt-4 text-muted-foreground">
          The prompt PDF has been sent to your email.
        </p>

        {/* Payment details: name, email, time, amount */}
        <div className="mt-6 rounded-xl border border-border bg-muted/30 px-4 py-4 text-left">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Payment details
          </p>
          <dl className="mt-3 space-y-2 text-sm">
            {name && (
              <div>
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-medium text-foreground">{name}</dd>
              </div>
            )}
            {email && (
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium text-foreground">{email}</dd>
              </div>
            )}
            <div>
              <dt className="text-muted-foreground">Payment time</dt>
              <dd className="font-medium text-foreground">
                {formatPaymentTime(displayTime)}
              </dd>
            </div>
            {amount != null && Number.isFinite(amount) && (
              <div>
                <dt className="text-muted-foreground">Amount</dt>
                <dd className="font-medium text-foreground">
                  {formatAmount(amount, currency)}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href={inboxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 min-w-[44px] items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background shadow-md transition-opacity hover:opacity-90"
          >
            <Inbox className="h-4 w-4 shrink-0" aria-hidden />
            Open inbox
          </a>
          <Link
            href="/"
            className="inline-flex h-11 min-w-[44px] items-center justify-center gap-2 rounded-xl border border-border bg-transparent px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Back to Generator
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </Link>
        </div>
      </div>
    );
  }

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

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-24 text-center text-muted-foreground">
          Loading…
        </div>
      }
    >
      <PaymentResultContent />
    </Suspense>
  );
}
