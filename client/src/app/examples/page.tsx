import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/common/CopyButton";
import { EXAMPLE_PROMPT } from "@/lib/examplePrompt";
import { parsePromptSections, shortSectionLabel } from "@/lib/promptSections";

const description =
  "A full worked example of a generated SEO implementation prompt, section by section — keywords, metadata, schema, content architecture, technical SEO, and Core Web Vitals.";

export const metadata: Metadata = {
  title: "Example Prompt",
  description,
  alternates: { canonical: "/examples" },
  openGraph: {
    title: "Example Prompt | SEO Prompt Generator",
    description,
    url: "/examples",
  },
};

const SCENARIOS = [
  {
    title: "SaaS landing page",
    body: "Commercial intent, one pillar page, comparison table, SoftwareApplication schema.",
  },
  {
    title: "Blog or content site",
    body: "Informational intent, topic clusters, Article + BreadcrumbList schema, internal link map.",
  },
  {
    title: "E-commerce category",
    body: "Transactional intent, Product + Review schema, faceted-navigation and canonical rules.",
  },
  {
    title: "Documentation site",
    body: "Navigational intent, deep-link structure, sitemap segmentation, crawl-budget guidance.",
  },
];

export default function ExamplesPage() {
  const sections = parsePromptSections(EXAMPLE_PROMPT);

  return (
    <div className="shell py-14 sm:py-20">
      <header className="mx-auto max-w-2xl text-center">
        <span className="pill">Example</span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          A real generated prompt
        </h1>
        <p className="mt-4 text-muted-foreground">
          This is the output for a SaaS landing page, shown section by section.
          Your prompt follows the same structure with your inputs.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/generate" className="btn btn-brand">
            Generate mine
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <CopyButton
            value={EXAMPLE_PROMPT}
            label="Copy this example"
            className="btn btn-outline"
          />
        </div>
      </header>

      <div className="mx-auto mt-14 max-w-3xl space-y-4">
        {sections.map((section, index) => (
          <section
            key={`${section.title ?? "intro"}-${index}`}
            className="card-surface overflow-hidden"
          >
            <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
              <h2 className="truncate text-sm font-semibold tracking-tight">
                {section.title ? shortSectionLabel(section.title) : "Overview"}
              </h2>
              <CopyButton
                value={section.body}
                className="btn btn-ghost h-8 min-h-8 px-2.5 text-xs"
              />
            </header>
            <pre className="prompt-scroll px-4 py-4 text-[13px] leading-relaxed sm:px-5">
              {section.body}
            </pre>
          </section>
        ))}
      </div>

      <section className="mx-auto mt-20 max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight">
          Other page types
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The generator adapts intent, schema, and content structure to the page
          type you pick.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {SCENARIOS.map((scenario) => (
            <article key={scenario.title} className="card-surface p-5">
              <h3 className="text-base font-semibold tracking-tight">
                {scenario.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {scenario.body}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
