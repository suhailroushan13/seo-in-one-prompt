import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardCheck,
  CreditCard,
  Cpu,
  PencilLine,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { SITE_NAME, SITE_URL, formatPrice } from "@/lib/product";

const description =
  "How to use your SEO prompt: fill in the wizard, pay once, then paste the prompt into Cursor, Claude Code, or any AI editor to generate a complete SEO implementation.";

export const metadata: Metadata = {
  title: "How it works",
  description,
  alternates: { canonical: "/how" },
  openGraph: {
    title: `How it works | ${SITE_NAME}`,
    description,
    url: "/how",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — one prompt, full SEO plan`,
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/og-image.png"] },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "How it works", item: `${SITE_URL}/how` },
  ],
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to generate and run an SEO implementation prompt",
  step: [
    { "@type": "HowToStep", name: "Describe your page in the wizard" },
    { "@type": "HowToStep", name: "Pay once through hosted checkout" },
    { "@type": "HowToStep", name: "Paste the prompt into your AI editor" },
    { "@type": "HowToStep", name: "Implement section by section and validate" },
  ],
};

const STEPS = [
  {
    Icon: PencilLine,
    title: "1. Describe your page",
    body: "Four short steps: project identity, keywords, content preferences, and technical options. Only the brand name, domain, and one primary keyword are required — everything else has a sensible default.",
  },
  {
    Icon: CreditCard,
    title: "2. Pay once",
    body: `${formatPrice()}, one time, through a hosted checkout. No account, no subscription, and card details never touch our servers.`,
  },
  {
    Icon: ClipboardCheck,
    title: "3. Collect your prompt",
    body: "It appears on the receipt page immediately and arrives by email as a PDF and a Markdown file. The delivery link stays live so you can re-download it later.",
  },
  {
    Icon: Cpu,
    title: "4. Run it in your editor",
    body: "Paste the whole prompt into Cursor, Claude Code, Windsurf, Copilot Chat, or ChatGPT. Implement one numbered section at a time and review each diff.",
  },
];

const TIPS = [
  {
    Icon: Sparkles,
    title: "Use a strong model",
    body: "Long structured prompts reward capable models. Claude Opus and Claude Sonnet follow the section ordering most reliably and produce consistent metadata and schema.",
  },
  {
    Icon: ShieldCheck,
    title: "Validate before you ship",
    body: "Run the generated JSON-LD through Google's Rich Results test, check the canonical and robots directives in the rendered HTML, then measure Core Web Vitals in Lighthouse.",
  },
  {
    Icon: ClipboardCheck,
    title: "Do not trim sections",
    body: "Later sections depend on decisions made in earlier ones — keyword mapping drives the content outline, which drives the schema. Paste it whole.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="shell py-14 sm:py-20">
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={howToJsonLd} />

      <header className="mx-auto max-w-2xl text-center">
        <span className="pill">How it works</span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          From blank page to shipped SEO
        </h1>
        <p className="mt-4 text-muted-foreground">
          Two minutes of input, one payment, and an implementation plan your AI
          editor can execute the same day.
        </p>
      </header>

      <ol className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2">
        {STEPS.map(({ Icon, title, body }) => (
          <li key={title} className="card-surface p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-muted text-brand">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <h2 className="mt-5 text-lg font-semibold tracking-tight">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </li>
        ))}
      </ol>

      <section className="mx-auto mt-20 max-w-4xl">
        <h2 className="text-2xl font-semibold tracking-tight">
          Getting the most out of it
        </h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {TIPS.map(({ Icon, title, body }) => (
            <article key={title} className="card-surface p-6">
              <Icon className="h-5 w-5 text-brand" aria-hidden />
              <h3 className="mt-4 text-base font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="mx-auto mt-16 max-w-4xl">
        <div className="card-surface flex flex-wrap items-center justify-between gap-5 p-6 sm:p-8">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Ready to build?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              The wizard remembers your draft, so you can stop and come back.
            </p>
          </div>
          <Link href="/generate" className="btn btn-brand">
            Open the generator
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
