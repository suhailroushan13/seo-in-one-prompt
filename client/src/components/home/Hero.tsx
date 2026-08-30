import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { formatPrice } from "@/lib/product";

const BADGES = [
  { Icon: Zap, label: "Ready in about 2 minutes" },
  { Icon: ShieldCheck, label: "One-time payment, no account" },
  { Icon: Sparkles, label: "PDF, Markdown & plain text" },
];

export function Hero() {
  return (
    <section className="grid-backdrop relative overflow-hidden border-b border-border">
      <div className="shell relative py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="pill animate-fade-in">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            One prompt. Your entire SEO build.
          </span>

          <h1 className="animate-fade-up mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Ship SEO that actually ranks —{" "}
            <span className="text-brand">in one prompt</span>
          </h1>

          <p className="animate-fade-up mt-6 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Answer a few questions about your page. Get a complete, structured
            implementation prompt — keywords, metadata, schema, technical SEO and
            Core Web Vitals targets — ready to paste into Cursor, Claude, or any
            AI editor.
          </p>

          <div className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/generate" className="btn btn-brand btn-lg w-full sm:w-auto">
              Generate my prompt
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/examples" className="btn btn-outline btn-lg w-full sm:w-auto">
              See a real example
            </Link>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            {formatPrice()} once · delivered to your inbox · no subscription
          </p>

          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {BADGES.map(({ Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Icon className="h-4 w-4 text-brand" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
