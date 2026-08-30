"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Mail,
  RefreshCcw,
} from "lucide-react";
import { PromptViewer } from "@/components/common/PromptViewer";
import type { DeliveryPayload } from "@/lib/deliveryPayload";
import { clearLastOrder, loadLastOrder } from "@/lib/formStorage";
import { CHECKOUT_URL } from "@/lib/product";

type Phase = "working" | "paid" | "pending" | "failed" | "unmatched";

/** How long to wait for the webhook when the provider gave us no status. */
const POLL_ATTEMPTS = 6;
const POLL_INTERVAL_MS = 2500;

function PaymentResult() {
  const params = useSearchParams();
  const [phase, setPhase] = useState<Phase>("working");
  const [order, setOrder] = useState<DeliveryPayload | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState<boolean | null>(null);
  const started = useRef(false);

  const finish = useCallback((payload: DeliveryPayload) => {
    setOrder(payload);
    setPhase(payload.status === "paid" ? "paid" : "pending");
    if (payload.status === "paid") clearLastOrder();
  }, []);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const providerStatus = params.get("status");
    const paymentId = params.get("payment_id");
    const reason = params.get("reason");
    const last = loadLastOrder();
    const orderId = params.get("order") ?? last?.orderId ?? null;
    const email = params.get("email") ?? last?.email ?? null;

    let cancelled = false;

    const readOrder = async (id: string): Promise<DeliveryPayload | null> => {
      const response = await fetch(`/api/order/${id}`, { cache: "no-store" });
      if (!response.ok) return null;
      const data = await response.json().catch(() => null);
      return (data?.order as DeliveryPayload) ?? null;
    };

    const complete = async () => {
      const response = await fetch("/api/payment/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderId ?? undefined,
          email: email ?? undefined,
          payment_id: paymentId ?? undefined,
          status: "success",
          brandName: last?.brandName || undefined,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (cancelled) return;

      if (data?.ok && data.order) {
        setEmailSent(Boolean(data.emailSent));
        if (data.emailError) {
          setMessage(
            "Payment confirmed, but the delivery email failed to send. Your prompt is below — use Resend or download it now."
          );
        }
        finish(data.order as DeliveryPayload);
        return;
      }

      setPhase("unmatched");
      setMessage(
        typeof data?.error === "string"
          ? data.error
          : "We could not match this payment to an order."
      );
    };

    const run = async () => {
      if (providerStatus === "failure") {
        setPhase("failed");
        setMessage(reason ?? null);
        if (orderId) {
          await fetch("/api/payment/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, status: "failed", reason }),
          }).catch(() => undefined);
        }
        return;
      }

      if (orderId) {
        const existing = await readOrder(orderId);
        if (cancelled) return;

        if (existing?.status === "paid") {
          finish(existing);
          return;
        }
        if (providerStatus === "success" || paymentId) {
          await complete();
          return;
        }

        // No outcome reported — wait for the provider's webhook.
        for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt += 1) {
          await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
          if (cancelled) return;
          const polled = await readOrder(orderId);
          if (polled?.status === "paid") {
            finish(polled);
            return;
          }
          if (polled?.status === "failed") {
            setPhase("failed");
            return;
          }
        }
        setOrder(existing);
        setPhase("pending");
        return;
      }

      if (paymentId || email) {
        await complete();
        return;
      }

      setPhase("unmatched");
      setMessage("This link is missing its order reference.");
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [params, finish]);

  if (phase === "working") {
    return (
      <StatusShell
        tone="neutral"
        icon={<Loader2 className="h-6 w-6 animate-spin" aria-hidden />}
        title="Confirming your payment"
        body="This takes a few seconds. Keep this tab open."
      />
    );
  }

  if (phase === "failed") {
    return (
      <StatusShell
        tone="danger"
        icon={<AlertTriangle className="h-6 w-6" aria-hidden />}
        title="Payment was not completed"
        body={
          message
            ? `Your card was not charged. ${message}`
            : "Your card was not charged. Your prompt is still saved in this browser, so you can try again without re-entering anything."
        }
      >
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={CHECKOUT_URL} className="btn btn-brand">
            Try payment again
          </a>
          <Link href="/generate" className="btn btn-outline">
            Back to my prompt
          </Link>
        </div>
      </StatusShell>
    );
  }

  if (phase === "unmatched") {
    return (
      <StatusShell
        tone="danger"
        icon={<AlertTriangle className="h-6 w-6" aria-hidden />}
        title="We could not find your order"
        body={
          message ??
          "If you were charged, email us your payment ID and we will deliver your prompt straight away."
        }
      >
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="mailto:support@seopromptai.com" className="btn btn-brand">
            <Mail className="h-4 w-4" aria-hidden />
            Contact support
          </a>
          <Link href="/generate" className="btn btn-outline">
            Back to the generator
          </Link>
        </div>
      </StatusShell>
    );
  }

  if (phase === "pending") {
    return (
      <StatusShell
        tone="neutral"
        icon={<Loader2 className="h-6 w-6 animate-spin" aria-hidden />}
        title="Payment is still processing"
        body="Your bank has not confirmed the charge yet. As soon as it does we email your prompt — you can safely close this tab."
      >
        {order && (
          <p className="field-hint mt-6">
            Order reference <span className="tabular">{order.orderId}</span>
          </p>
        )}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn btn-outline"
          >
            <RefreshCcw className="h-4 w-4" aria-hidden />
            Check again
          </button>
        </div>
      </StatusShell>
    );
  }

  if (!order?.prompt) return null;

  return (
    <div className="shell py-12 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-muted text-brand mx-auto">
          <CheckCircle2 className="h-7 w-7" aria-hidden />
        </span>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
          Payment confirmed
        </h1>
        <p className="mt-3 text-muted-foreground">
          {emailSent === false
            ? "Your prompt is ready below."
            : `Your prompt is ready below and on its way to ${order.email}.`}
        </p>
        {message && (
          <p className="field-error mx-auto mt-4 max-w-lg" role="alert">
            {message}
          </p>
        )}
        <p className="field-hint mt-4">
          Keep this link — it reopens your prompt any time:{" "}
          <Link
            href={`/delivery/${order.orderId}`}
            className="text-brand underline-offset-4 hover:underline"
          >
            /delivery/{order.orderId}
          </Link>
        </p>
      </div>

      <div className="mt-12">
        <PromptViewer
          prompt={order.prompt}
          brandName={order.brandName ?? undefined}
          fullName={order.name ?? undefined}
          email={order.email}
          orderId={order.orderId}
          generatedAt={order.paidAt ?? undefined}
          filenames={order.filenames}
        />
      </div>

      <div className="mt-12 text-center">
        <Link href="/generate" className="btn btn-outline">
          Generate another prompt
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

function StatusShell({
  tone,
  icon,
  title,
  body,
  children,
}: {
  tone: "neutral" | "danger";
  icon: React.ReactNode;
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="shell py-20">
      <div className="card-surface mx-auto max-w-lg p-8 text-center sm:p-10">
        <span
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${
            tone === "danger"
              ? "bg-destructive/10 text-destructive"
              : "bg-brand-muted text-brand"
          }`}
        >
          {icon}
        </span>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
        {children}
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
        <StatusShell
          tone="neutral"
          icon={<Loader2 className="h-6 w-6 animate-spin" aria-hidden />}
          title="Loading your receipt"
          body="One moment."
        />
      }
    >
      <PaymentResult />
    </Suspense>
  );
}
