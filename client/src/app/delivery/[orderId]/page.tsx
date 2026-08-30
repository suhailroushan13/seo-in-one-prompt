import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock } from "lucide-react";
import { PromptViewer } from "@/components/common/PromptViewer";
import { ResendButton } from "@/components/common/ResendButton";
import { findOrderById, toDeliveryPayload } from "@/lib/orders";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your SEO prompt",
  description: "Download and copy the SEO implementation prompt for your order.",
  robots: { index: false, follow: false },
};

const ORDER_ID_PATTERN = /^ord_[a-f0-9]{16,64}$/;

export default async function DeliveryPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  if (!ORDER_ID_PATTERN.test(orderId)) notFound();

  const document = await findOrderById(orderId);
  if (!document) notFound();

  const order = toDeliveryPayload(document);

  if (order.status !== "paid" || !order.prompt) {
    return (
      <div className="shell py-20">
        <div className="card-surface mx-auto max-w-lg p-8 text-center sm:p-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-muted text-muted-foreground">
            <Clock className="h-7 w-7" aria-hidden />
          </span>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight">
            This order is not complete yet
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {order.status === "failed"
              ? "The payment did not go through, so nothing was charged. Start again and your draft will still be there."
              : "We have not received confirmation of the payment yet. Refresh in a moment, or start again — nothing is charged twice."}
          </p>
          <Link href="/generate" className="btn btn-brand mt-7">
            Back to the generator
          </Link>
        </div>
      </div>
    );
  }

  const paidAt = order.paidAt
    ? new Date(order.paidAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="shell py-12 sm:py-16">
      <header className="card-surface flex flex-wrap items-center justify-between gap-5 p-6 sm:p-8">
        <div className="flex min-w-0 items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-muted text-brand">
            <CheckCircle2 className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {order.brandName?.trim() || "Your SEO prompt"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Order <span className="tabular">{order.orderId}</span>
              {paidAt ? ` · paid ${paidAt}` : ""} · delivered to {order.email}
            </p>
          </div>
        </div>
        <ResendButton orderId={order.orderId} email={order.email} />
      </header>

      <div className="mt-8">
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
    </div>
  );
}
