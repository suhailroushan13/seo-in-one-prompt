import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, Copy, Sparkles } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://seoprompt.ai";

export const metadata: Metadata = {
  title: "How to use",
  description:
    "Paste the SEO prompt into Cursor, Antigravity, or any AI editor to generate a full SEO plan. Best results with Claude Opus or Claude Sonnet.",
  alternates: { canonical: "/how" },
  openGraph: {
    title: "How to use | SEO Prompt Generator",
    description:
      "Paste the prompt in Cursor, Antigravity, or any AI editor to get a complete SEO strategy. Use Claude Opus or Claude Sonnet for best results.",
    url: "/how",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SEO Prompt Generator — One prompt, full SEO plan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "How to use", item: `${SITE_URL}/how` },
  ],
};

export default function HowToUsePage() {
  return (
    <div className="min-h-full">
      <JsonLd data={breadcrumbJsonLd} />
      <header className="border-b border-border/50 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex min-h-10 min-w-10 cursor-pointer items-center justify-center gap-2 rounded-lg px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            <span>Back to home</span>
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-10 flex flex-wrap items-center gap-3 sm:mb-12">
          <BookOpen className="h-8 w-8 shrink-0 text-muted-foreground sm:h-9 sm:w-9" aria-hidden />
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">How to use</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Paste the prompt in your AI editor and get a full SEO plan for your project
            </p>
          </div>
        </div>

        <div className="space-y-8 sm:space-y-10">
          <section className="rounded-xl border border-border/60 bg-card/50 p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground sm:text-xl">
              <Copy className="h-5 w-5 text-muted-foreground" aria-hidden />
              Where to paste
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              After you generate your SEO prompt on this site, copy it and paste it directly into{" "}
              <strong className="text-foreground">Cursor</strong>,{" "}
              <strong className="text-foreground">Antigravity</strong>, or any AI-powered editor. The model will use your project details to generate a complete SEO strategy: keywords, content structure, meta tags, structured data, sitemap guidance, and optimization instructions—all in one go.
            </p>
          </section>

          <section className="rounded-xl border border-border/60 bg-card/50 p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground sm:text-xl">
              <Sparkles className="h-5 w-5 text-muted-foreground" aria-hidden />
              Best models for best results
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              For the most accurate and detailed SEO output, use stronger models such as{" "}
              <strong className="text-foreground">Claude Opus</strong> (latest) or{" "}
              <strong className="text-foreground">Claude Sonnet</strong>. They follow long, structured prompts better and produce more consistent metadata, schema, and implementation guidance for your stack.
            </p>
          </section>

          <section className="rounded-lg border border-border/50 bg-muted/30 p-4 sm:p-5">
            <h2 className="text-base font-semibold text-foreground">Quick steps</h2>
            <ol className="mt-3 list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Fill in your project details on the <Link href="/generate" className="font-medium text-foreground underline-offset-4 hover:underline">generator</Link>.</li>
              <li>Copy the generated prompt.</li>
              <li>Paste it into Cursor, Antigravity, or your preferred AI editor.</li>
              <li>Use Claude Opus or Claude Sonnet for best results.</li>
              <li>Get your full SEO plan and implementation details in one response.</li>
            </ol>
          </section>
        </div>

        <footer className="mt-10 pt-6 border-t border-border/50 sm:mt-12 sm:pt-8">
          <Link
            href="/generate"
            className="inline-flex min-h-10 min-w-10 cursor-pointer items-center justify-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-foreground underline-offset-4 hover:bg-muted hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            Go to generator
          </Link>
        </footer>
      </article>
    </div>
  );
}
