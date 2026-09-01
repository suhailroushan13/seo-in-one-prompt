import Link from "next/link";
import { ArrowRight, Lock, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { formatPrice } from "@/lib/product";

const BADGES = [
  { Icon: Zap, label: "Ready in about 2 minutes" },
  { Icon: ShieldCheck, label: "One-time payment, no account" },
  { Icon: Sparkles, label: "PDF, Markdown & plain text" },
];

/** The ten sections of the delivered prompt. Titles only — the body is the product. */
const SECTIONS = [
  "Keyword strategy & mapping",
  "Metadata & social tags",
  "Structured data (JSON-LD)",
  "Content architecture",
  "Internal linking plan",
  "Technical SEO",
  "Core Web Vitals targets",
  "Image & media strategy",
  "Analytics & measurement",
  "Deliverables checklist",
];

/** Deterministic bar widths so the locked preview does not shift between renders. */
const BAR_WIDTHS = ["92%", "74%", "84%", "61%", "88%", "70%"];

export function Hero() {
  return (
    <section className="hero-glow grid-backdrop relative overflow-hidden border-b border-border">
      <div className="shell relative py-16 sm:py-24">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div className="max-w-2xl text-center lg:text-left">
            <span className="pill animate-fade-in">
              <Sparkles className="h-3.5 w-3.5 text-brand" aria-hidden />
              One prompt. Your entire SEO build.
            </span>

            <h1 className="animate-fade-up mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Ship SEO that actually ranks —{" "}
              <span className="text-gradient">in one prompt</span>
            </h1>

            <p className="animate-fade-up mt-6 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Answer a few questions about your page. Get a complete, structured
              implementation prompt — keywords, metadata, schema, technical SEO and
              Core Web Vitals targets — ready to paste into Cursor, Claude, or any
              AI editor.
            </p>

            <div className="animate-fade-up mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link href="/generate" className="btn btn-brand btn-lg w-full sm:w-auto">
                Generate my prompt
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="#how-it-works" className="btn btn-outline btn-lg w-full sm:w-auto">
                See how it works
              </Link>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              {formatPrice()} once · delivered to your inbox · no subscription
            </p>

            <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start">
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

          <div className="animate-fade-up relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="card-surface overflow-hidden">
              <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-success" />
                  <span className="truncate text-xs font-medium text-muted-foreground">
                    your-domain.com · SEO implementation prompt
                  </span>
                </div>
                <span className="pill h-7 gap-1.5 px-2.5 text-[11px]">
                  <Lock className="h-3 w-3" aria-hidden />
                  Locked
                </span>
              </header>

              <ol className="divide-y divide-border">
                {SECTIONS.map((section, index) => (
                  <li
                    key={section}
                    className="flex items-center gap-3 px-4 py-2.5"
                  >
                    <span className="tabular w-5 shrink-0 text-[11px] font-medium text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
                      {section}
                    </span>
                    <span
                      aria-hidden
                      className="redacted h-2 shrink-0"
                      style={{ width: BAR_WIDTHS[index % BAR_WIDTHS.length], maxWidth: "38%" }}
                    />
                  </li>
                ))}
              </ol>

              <footer className="flex items-center gap-2 border-t border-border bg-surface-muted px-4 py-3 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5 text-brand" aria-hidden />
                Full text unlocks the moment your payment clears.
              </footer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
