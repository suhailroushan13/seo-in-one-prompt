import {
  Gauge,
  KeyRound,
  LayoutList,
  Link2,
  Settings2,
  Tags,
} from "lucide-react";

const ITEMS = [
  {
    Icon: KeyRound,
    title: "Keyword strategy",
    body: "One primary keyword, supporting terms, search intent, competitor set, and a cluster plan that avoids cannibalisation.",
  },
  {
    Icon: Tags,
    title: "Metadata & social",
    body: "Exact title, description, canonical, robots directives, Open Graph and Twitter card tags — written, not described.",
  },
  {
    Icon: LayoutList,
    title: "Content architecture",
    body: "H1/H2/H3 outline, word-count targets, comparison tables, and an FAQ block that mirrors your schema.",
  },
  {
    Icon: Link2,
    title: "Structured data",
    body: "Valid JSON-LD for Organization, WebSite, BreadcrumbList, FAQPage and your page-specific types.",
  },
  {
    Icon: Settings2,
    title: "Technical SEO",
    body: "Sitemap and robots files, per-route rendering strategy, image pipeline, internal linking, and i18n scope.",
  },
  {
    Icon: Gauge,
    title: "Core Web Vitals",
    body: "Concrete LCP, INP and CLS targets with the font, CSS, and code-splitting work needed to hit them.",
  },
];

export function Deliverables() {
  return (
    <section className="border-y border-border bg-surface-muted py-20 sm:py-24">
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <span className="pill">What you get</span>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            Ten sections. Nothing left to guess.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every section is written as instructions an AI editor can execute
            directly — no summaries, no placeholders.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map(({ Icon, title, body }) => (
            <article key={title} className="card-surface p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-muted text-brand">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-4 text-base font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
