import { CreditCard, FileCheck2, PencilLine } from "lucide-react";

const STEPS = [
  {
    Icon: PencilLine,
    title: "Describe your page",
    body: "Brand, domain, page type, stack, audience, keywords, competitors. A guided wizard — every field explained, nothing guessed.",
  },
  {
    Icon: CreditCard,
    title: "Pay once",
    body: "Secure hosted checkout. No account, no subscription, no card details ever touch our servers.",
  },
  {
    Icon: FileCheck2,
    title: "Get your prompt",
    body: "The full prompt appears on screen and lands in your inbox as a PDF and a Markdown file. Yours to keep and reuse.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 py-20 sm:py-24">
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <span className="pill">How it works</span>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            Three steps, about two minutes
          </h2>
          <p className="mt-4 text-muted-foreground">
            No onboarding, no demo call, no trial that expires. Answer, pay, build.
          </p>
        </div>

        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {STEPS.map(({ Icon, title, body }, index) => (
            <li key={title} className="card-surface relative p-6">
              <span
                aria-hidden
                className="tabular absolute right-5 top-5 text-5xl font-semibold leading-none text-border-strong/40"
              >
                {index + 1}
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-muted text-brand">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
