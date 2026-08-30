import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DELIVERABLES, formatPrice } from "@/lib/product";

const description =
  "How the SEO prompt generator works: what each wizard field controls, what the delivered prompt contains, how delivery and re-download work, and how to run the prompt in your AI editor.";

export const metadata: Metadata = {
  title: "Documentation",
  description,
  alternates: { canonical: "/docs" },
  openGraph: {
    title: "Documentation | SEO Prompt Generator",
    description,
    url: "/docs",
  },
};

const SECTIONS = [
  {
    id: "overview",
    title: "Overview",
    paragraphs: [
      "This tool turns a short description of one web page into a complete SEO implementation prompt — a structured document an AI coding assistant can execute directly, or a developer can follow as a specification.",
      "Nothing is generated server-side from your draft until you choose to continue: the wizard builds the prompt in your browser and stores it in local storage. Your prompt is sent to our server only when you start checkout, so it can be emailed to you afterwards.",
    ],
  },
  {
    id: "wizard",
    title: "The wizard fields",
    list: [
      ["Brand name and domain", "Required. They anchor titles, canonical URLs, sitemap entries, and Organization schema."],
      ["Page type", "Selects the schema types, intent framing, and content structure the prompt recommends."],
      ["Primary keyword", "Required, and exactly one. Every other section maps back to it so pages never cannibalise each other."],
      ["Secondary keywords", "Used as supporting and LSI terms across H2s and body copy."],
      ["Search intent and audience", "Set tone, reading level, and the shape of the FAQ block."],
      ["Content style, tone, length", "Control voice and target word count for the copy the prompt asks for."],
      ["Technical options", "Rendering strategy, structured data, sitemap approach, image format, load target, CDN, analytics, and robots rules are written into the prompt verbatim."],
    ],
  },
  {
    id: "delivery",
    title: "Delivery",
    paragraphs: [
      `Payment is ${formatPrice()}, once, through a hosted checkout. Card details never reach our servers.`,
      "As soon as the payment is confirmed, the prompt appears on the receipt page and an email goes out with a PDF and a Markdown copy attached. The receipt page also gives you a permanent delivery link — bookmark it, and you can re-download or trigger a resend at any time.",
      "Confirmation is driven by a signed webhook from the payment provider, so delivery still happens if you close the tab before the redirect completes.",
    ],
  },
  {
    id: "usage",
    title: "Running the prompt",
    list: [
      ["1. Open your AI editor", "Cursor, Claude Code, Windsurf, Copilot Chat, or plain ChatGPT all work."],
      ["2. Paste the whole prompt", "Do not trim sections — the later ones depend on decisions made in the earlier ones."],
      ["3. Work section by section", "Ask it to implement one numbered section at a time and review the diff before moving on."],
      ["4. Validate", "Run the generated JSON-LD through the Rich Results test and check Core Web Vitals in Lighthouse."],
    ],
  },
  {
    id: "privacy",
    title: "Data and privacy",
    paragraphs: [
      "There are no accounts and no passwords. Your draft lives in your browser's local storage until you clear it with the Clear all button.",
      "After purchase we store the order, your email, and the generated prompt so that delivery and re-download work. Orders expire automatically 60 days after creation.",
    ],
  },
] as const;

export default function DocsPage() {
  return (
    <div className="shell py-14 sm:py-20">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav aria-label="Documentation" className="card-surface p-4">
            <h2 className="field-label">On this page</h2>
            <ul className="mt-3 space-y-1">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="min-w-0">
          <header>
            <span className="pill">Documentation</span>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              How it all works
            </h1>
            <p className="mt-4 text-muted-foreground">
              Everything worth knowing before and after you generate a prompt.
            </p>
          </header>

          <div className="mt-12 space-y-14">
            {SECTIONS.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  {section.title}
                </h2>
                {"paragraphs" in section &&
                  section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="mt-4 text-sm leading-relaxed text-muted-foreground"
                    >
                      {paragraph}
                    </p>
                  ))}
                {"list" in section && (
                  <dl className="mt-5 space-y-4">
                    {section.list.map(([term, definition]) => (
                      <div key={term} className="card-surface p-4">
                        <dt className="text-sm font-semibold">{term}</dt>
                        <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                          {definition}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </section>
            ))}

            <section className="card-surface p-6 sm:p-8">
              <h2 className="text-xl font-semibold tracking-tight">
                What is in the delivered prompt
              </h2>
              <ul className="mt-5 space-y-2.5">
                {DELIVERABLES.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/generate" className="btn btn-brand mt-7">
                Generate a prompt
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
