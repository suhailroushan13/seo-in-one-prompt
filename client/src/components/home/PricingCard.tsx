import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { DELIVERABLES, PRICE, formatPrice } from "@/lib/product";

export function PricingCard({ id = "pricing" }: { id?: string }) {
  return (
    <section id={id} className="scroll-mt-24 py-20 sm:py-24">
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <span className="pill">Pricing</span>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            One price. One prompt. No subscription.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Pay per prompt. Nothing recurring, nothing to cancel.
          </p>
        </div>

        <div className="card-surface mx-auto mt-12 max-w-xl overflow-hidden">
          <div className="border-b border-border bg-surface-muted px-6 py-8 text-center sm:px-8">
            <p className="text-sm font-medium text-muted-foreground">
              Complete SEO implementation prompt
            </p>
            <p className="mt-3 flex items-baseline justify-center gap-2">
              <span className="tabular text-5xl font-semibold tracking-tight">
                {formatPrice()}
              </span>
              <span className="text-sm text-muted-foreground">
                {PRICE.currency} · one-time
              </span>
            </p>
          </div>

          <div className="px-6 py-8 sm:px-8">
            <ul className="space-y-3">
              {DELIVERABLES.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-muted text-brand"
                  >
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/generate" className="btn btn-brand btn-lg mt-8 w-full">
              Start now
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <p className="field-hint mt-3 text-center">
              Secure hosted checkout. Card details never touch our servers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
