import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { ScrollToHash } from "@/components/ScrollToHash";
import { JsonLd } from "@/components/JsonLd";
import {
  TECH_OPTIONS,
  PAGE_TYPE_OPTIONS,
  SEARCH_INTENT_OPTIONS,
  CONTENT_STYLE_OPTIONS,
  CONTENT_TONE_OPTIONS,
  CONTENT_LENGTH_OPTIONS,
  TITLE_FORMAT_OPTIONS,
  RENDERING_OPTIONS,
  STRUCTURED_DATA_OPTIONS,
  SITEMAP_OPTIONS,
  IMAGE_FORMAT_OPTIONS,
  LOAD_TARGET_OPTIONS,
  CDN_OPTIONS,
  ANALYTICS_OPTIONS,
} from "@/lib/types";

export const metadata: Metadata = {
  title: "Help",
  description:
    "Learn what each form field means: brand, domain, keywords, content strategy, and output options. Examples and defaults for the SEO prompt generator.",
  alternates: { canonical: "/help" },
  openGraph: {
    title: "Help | SEO Prompt Generator",
    description:
      "Learn what each form field means with examples and defaults for the SEO prompt generator.",
    url: "/help",
  },
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://seoprompt.ai";

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Help",
      item: `${SITE_URL}/help`,
    },
  ],
};

function HelpSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-2 first:pt-0">
      <h2 className="text-lg font-semibold text-foreground border-b border-border/60 pb-2 mb-4 sm:text-xl">
        {title}
      </h2>
      <div className="space-y-4 sm:space-y-6">{children}</div>
    </section>
  );
}

function HelpItem({
  label,
  description,
  example,
  default: defaultVal,
  options,
}: {
  label: string;
  description: string;
  example?: string;
  default?: string;
  options?: readonly string[] | readonly { label: string; value?: string }[];
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/50 p-4 sm:p-4">
      <h3 className="text-sm font-semibold text-foreground mb-1">{label}</h3>
      <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{description}</p>
      {example && (
        <p className="text-xs text-muted-foreground/80 mb-1 break-words">
          <span className="font-medium">Example:</span> {example}
        </p>
      )}
      {defaultVal && (
        <p className="text-xs text-muted-foreground/80 mb-1 break-words">
          <span className="font-medium">Default:</span> {defaultVal}
        </p>
      )}
      {options && options.length > 0 && (
        <p className="text-xs text-muted-foreground/80 mt-2 break-words">
          <span className="font-medium">Options:</span>{" "}
          <span className="inline">{options.map((o) => (typeof o === "string" ? o : o.label)).join(" · ")}</span>
        </p>
      )}
    </div>
  );
}

export default function HelpPage() {
  return (
    <div className="min-h-full">
      <JsonLd data={breadcrumbJsonLd} />
      <header className="border-b border-border/50 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <Link
            href="/generate"
            className="inline-flex min-h-10 min-w-10 cursor-pointer items-center justify-center gap-2 rounded-lg px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            <span>Back to form</span>
          </Link>
        </div>
      </header>

      <ScrollToHash />
      <article className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-8 flex flex-wrap items-center gap-3 sm:mb-10">
          <HelpCircle className="h-7 w-7 shrink-0 text-muted-foreground sm:h-8 sm:w-8" aria-hidden />
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Help</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              What each form field means, with examples and defaults
            </p>
          </div>
        </div>

        <div className="space-y-10 sm:space-y-12">
          <HelpSection id="step-1" title="Step 1 — Project Identity">
            <HelpItem
              label="Brand name"
              description="The name of your company, product, or brand. It will be used consistently in the generated SEO prompt and meta tags."
              example="Acme Inc, My SaaS, DevHire"
              default="(empty — prompt will use a placeholder)"
            />
            <HelpItem
              label="Domain"
              description="Your website’s full URL. Use HTTPS and no trailing slash. This is used for canonical URLs, sitemaps, and Open Graph tags."
              example="https://example.com, https://myapp.io"
              default="(empty — prompt will use a placeholder)"
            />
            <HelpItem
              label="Project description"
              description="A short description of what your project or site does. Helps the SEO prompt understand context and suggest relevant structure."
              example="A platform to hire developers from GitHub"
              default="(empty)"
            />
            <HelpItem
              label="Page type"
              description="The kind of page or site you’re optimizing. This shapes the content structure and SEO recommendations."
              example="SaaS Landing Page, Blog, E-commerce"
              default={PAGE_TYPE_OPTIONS[0].label}
              options={PAGE_TYPE_OPTIONS.map((o) => o.label)}
            />
            <HelpItem
              label="Tech stack"
              description="The framework and technologies your site uses. The prompt will suggest implementation details that match your stack (e.g. Next.js metadata API)."
              default={TECH_OPTIONS[0]}
              options={TECH_OPTIONS}
            />
            <HelpItem
              label="Custom stack"
              description="Only shown when Tech stack is “Custom”. Describe your stack in your own words (e.g. Laravel + React, WordPress)."
              example="Laravel + React, WordPress + custom theme"
            />
          </HelpSection>

          <HelpSection id="step-2" title="Step 2 — SEO Keywords">
            <HelpItem
              label="Primary keyword"
              description="The main search phrase you want this page to rank for. One primary keyword per page is recommended to avoid cannibalization."
              example="best project management tool for startups"
              default="(empty)"
            />
            <HelpItem
              label="Secondary keywords"
              description="Related or supporting keywords (LSI, long-tail). Add them as tags; they’ll be woven into the content and headings."
              example="remote developer hiring, GitHub talent, find developers"
              default="(empty)"
            />
            <HelpItem
              label="Search intent"
              description="What the user is trying to do when they search: learn (informational), evaluate/buy (commercial), take action (transactional), or find a brand (navigational)."
              default={SEARCH_INTENT_OPTIONS[0].value}
              options={SEARCH_INTENT_OPTIONS.map((o) => o.label)}
            />
            <HelpItem
              label="Target audience"
              description="Who you’re writing for. Helps tailor tone, depth, and calls-to-action in the prompt."
              example="CTOs, HR leaders, indie hackers, small business owners"
              default="(empty)"
            />
          </HelpSection>

          <HelpSection id="step-3" title="Step 3 — Content Strategy">
            <HelpItem
              label="Competitor domains"
              description="Sites you consider competitors. The prompt can reference analyzing and outperforming them (e.g. for content ideas)."
              example="competitor.com, other-tool.com"
              default="(empty)"
            />
            <HelpItem
              label="Content style"
              description="The overall style of your content: professional, casual, technical, or marketing-focused."
              default={CONTENT_STYLE_OPTIONS[0]}
              options={CONTENT_STYLE_OPTIONS}
            />
            <HelpItem
              label="Tone of writing"
              description="The voice of your copy: authoritative, friendly, persuasive, educational, or minimalist."
              default={CONTENT_TONE_OPTIONS[0]}
              options={CONTENT_TONE_OPTIONS}
            />
            <HelpItem
              label="Content length"
              description="Target length for the main content. Affects how much the prompt asks for (e.g. short vs long-form)."
              default={CONTENT_LENGTH_OPTIONS[1]}
              options={CONTENT_LENGTH_OPTIONS}
            />
            <HelpItem
              label="Extra notes"
              description="Any special requirements: accessibility, specific schema, regional SEO, or custom instructions for the AI."
              example="Focus on EU audience, add FAQ schema, WCAG AA"
            />
          </HelpSection>

          <HelpSection id="step-4" title="Step 4 — Output Options">
            <HelpItem
              label="Title format"
              description="How the page title (and similar titles) should be structured: brand first, keyword first, or combined."
              default={TITLE_FORMAT_OPTIONS[0]}
              options={TITLE_FORMAT_OPTIONS}
            />
            <HelpItem
              label="Rendering strategy"
              description="How your app serves pages: static (SSG), server-rendered (SSR), incremental (ISR), or client-side (CSR). Affects SEO and performance advice."
              default={RENDERING_OPTIONS[0]}
              options={RENDERING_OPTIONS}
            />
            <HelpItem
              label="Structured data"
              description="Which JSON-LD schema(s) to include: WebSite, Organization, Article, Product, FAQ, or none."
              default={STRUCTURED_DATA_OPTIONS[0]}
              options={STRUCTURED_DATA_OPTIONS}
            />
            <HelpItem
              label="Sitemap"
              description="How the sitemap is generated: dynamic route, static file, or a package like next-sitemap."
              default={SITEMAP_OPTIONS[0]}
              options={SITEMAP_OPTIONS}
            />
            <HelpItem
              label="Image format"
              description="Preferred image format and optimization (e.g. WebP, AVIF, next/image)."
              default={IMAGE_FORMAT_OPTIONS[0]}
              options={IMAGE_FORMAT_OPTIONS}
            />
            <HelpItem
              label="Load target"
              description="Target load time for performance (e.g. under 2s). Used in the prompt’s performance section."
              default={LOAD_TARGET_OPTIONS[1]}
              options={LOAD_TARGET_OPTIONS}
            />
            <HelpItem
              label="CDN"
              description="Content delivery network you use or plan to use. Referenced in performance and caching advice."
              default={CDN_OPTIONS[0]}
              options={CDN_OPTIONS}
            />
            <HelpItem
              label="Analytics"
              description="Analytics or tracking setup (e.g. GA4, Plausible, Vercel Analytics). The prompt can mention integration."
              default={ANALYTICS_OPTIONS[0]}
              options={ANALYTICS_OPTIONS}
            />
            <HelpItem
              label="Robots.txt rules"
              description="Custom rules for robots.txt (e.g. disallow /api/, /admin/). Leave blank for a sensible default."
              example="block /api/ and /admin/, allow all public pages"
            />
          </HelpSection>
        </div>

        <footer className="mt-10 pt-6 border-t border-border/50 sm:mt-12 sm:pt-8">
          <Link
            href="/generate"
            className="inline-flex min-h-10 min-w-10 cursor-pointer items-center justify-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-foreground underline-offset-4 hover:bg-muted hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            Back to form
          </Link>
        </footer>
      </article>
    </div>
  );
}
