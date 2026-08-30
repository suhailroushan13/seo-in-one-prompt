import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
import { SITE_NAME, SITE_URL, formatPrice } from "@/lib/product";

export const metadata: Metadata = {
  title: "Help",
  description:
    "What every wizard field means, with examples and defaults — plus how payment, delivery, and re-downloads work.",
  alternates: { canonical: "/help" },
  openGraph: {
    title: `Help | ${SITE_NAME}`,
    description:
      "What every wizard field means, with examples and defaults — plus how payment and delivery work.",
    url: "/help",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — one prompt, full SEO plan`,
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
    <section id={id} className="scroll-mt-24">
      <h2 className="border-b border-border pb-3 text-xl font-semibold tracking-tight">
        {title}
      </h2>
      <div className="mt-5 space-y-4">{children}</div>
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
    <div className="card-surface p-5">
      <h3 className="text-sm font-semibold">{label}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <dl className="mt-3 space-y-1.5 text-xs text-muted-foreground">
        {example && (
          <div className="flex gap-2 break-words">
            <dt className="shrink-0 font-medium text-foreground/80">Example</dt>
            <dd>{example}</dd>
          </div>
        )}
        {defaultVal && (
          <div className="flex gap-2 break-words">
            <dt className="shrink-0 font-medium text-foreground/80">Default</dt>
            <dd>{defaultVal}</dd>
          </div>
        )}
        {options && options.length > 0 && (
          <div className="flex gap-2 break-words">
            <dt className="shrink-0 font-medium text-foreground/80">Options</dt>
            <dd>
              {options
                .map((option) => (typeof option === "string" ? option : option.label))
                .join(" · ")}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}

const NAV = [
  { href: "#step-1", label: "1 — Project" },
  { href: "#step-2", label: "2 — Keywords" },
  { href: "#step-3", label: "3 — Content" },
  { href: "#step-4", label: "4 — Technical" },
  { href: "#delivery", label: "Payment & delivery" },
];

export default function HelpPage() {
  return (
    <div className="shell py-14 sm:py-20">
      <JsonLd data={breadcrumbJsonLd} />
      <ScrollToHash />

      <header className="mx-auto max-w-2xl text-center">
        <span className="pill">Help</span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          Every field, explained
        </h1>
        <p className="mt-4 text-muted-foreground">
          What each wizard field controls, what a good answer looks like, and
          what happens after you pay.
        </p>
      </header>

      <div className="mx-auto mt-14 grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav aria-label="Help sections" className="card-surface p-4">
            <h2 className="field-label">Jump to</h2>
            <ul className="mt-3 space-y-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <Link href="/generate" className="btn btn-brand mt-4 w-full">
              Open the generator
            </Link>
          </nav>
        </aside>

        <article className="min-w-0 space-y-14">
          <HelpSection id="step-1" title="Step 1 — Project">
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

          <HelpSection id="step-2" title="Step 2 — Keywords">
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

          <HelpSection id="step-3" title="Step 3 — Content">
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

          <HelpSection id="step-4" title="Step 4 — Technical">
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

          <HelpSection id="delivery" title="Payment & delivery">
            <HelpItem
              label="What it costs"
              description={`${formatPrice()} once, per prompt. There is no account, no subscription, and nothing recurring to cancel.`}
            />
            <HelpItem
              label="How you receive it"
              description="The prompt appears on the receipt page the moment payment is confirmed, and an email arrives with a PDF and a Markdown copy attached."
            />
            <HelpItem
              label="Re-downloading later"
              description="Your receipt links to a permanent delivery page. Open it any time to copy the prompt, download it again in any format, or resend the email."
            />
            <HelpItem
              label="If the email never arrives"
              description="Check spam first, then use the resend button on your delivery page. If you were charged and cannot find the order at all, email support with your payment ID."
              example="support@seopromptai.com"
            />
            <HelpItem
              label="If a payment fails"
              description="Nothing is charged and your draft stays in this browser, so you can retry checkout without re-entering anything."
            />
          </HelpSection>

          <div className="card-surface flex flex-wrap items-center justify-between gap-4 p-6">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Still stuck?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Email{" "}
                <a
                  href="mailto:support@seopromptai.com"
                  className="text-brand underline-offset-4 hover:underline"
                >
                  support@seopromptai.com
                </a>{" "}
                and we will get back to you.
              </p>
            </div>
            <Link href="/generate" className="btn btn-outline">
              Back to the form
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
