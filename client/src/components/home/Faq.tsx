import { ChevronDown } from "lucide-react";
import { formatPrice } from "@/lib/product";

export const FAQ_ITEMS = [
  {
    question: "What exactly do I receive?",
    answer:
      "One complete SEO implementation prompt covering keyword strategy, metadata, structured data, content architecture, technical SEO, and Core Web Vitals targets. It arrives on screen straight after payment and by email as a PDF plus a Markdown file.",
  },
  {
    question: "Do I need an account?",
    answer:
      "No. There is no sign-up and no password. Your email is used to deliver the prompt and to look up your order if you need it resent.",
  },
  {
    question: "Which AI tools does the prompt work with?",
    answer:
      "Any of them. It is plain structured text — paste it into Cursor, Claude Code, ChatGPT, Windsurf, Copilot, or hand it to a developer as a specification.",
  },
  {
    question: "Is this a subscription?",
    answer: `No. It is ${formatPrice()} once, per prompt. There is nothing recurring and nothing to cancel.`,
  },
  {
    question: "The email never arrived. What now?",
    answer:
      "Check spam first. Your prompt also stays available on its delivery page — the link in your receipt — where you can re-download it or trigger a resend.",
  },
  {
    question: "Can I use it for more than one page?",
    answer:
      "The prompt is tailored to the page you described, and it works best that way. For a second page type, generate a second prompt so the keyword mapping stays clean.",
  },
] as const;

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 border-t border-border py-20 sm:py-24">
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <span className="pill">FAQ</span>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            Questions, answered
          </h2>
        </div>

        <div className="mx-auto mt-12 max-w-3xl divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium transition-colors hover:bg-surface-muted">
                {item.question}
                <ChevronDown
                  aria-hidden
                  className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
