"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CopyButton } from "@/components/common/CopyButton";
import { EXAMPLE_PROMPT } from "@/lib/examplePrompt";

export function SamplePrompt() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="example-output" className="scroll-mt-24 py-20 sm:py-24">
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <span className="pill">Sample output</span>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            This is what lands in your inbox
          </h2>
          <p className="mt-4 text-muted-foreground">
            A real prompt for a SaaS landing page, trimmed for the web. The full
            version runs to ten sections.
          </p>
        </div>

        <div className="card-surface mx-auto mt-12 max-w-4xl overflow-hidden">
          <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
            <div className="flex min-w-0 items-center gap-2.5">
              <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-success" />
              <span className="truncate text-xs font-medium text-muted-foreground">
                devhire.io · SaaS landing page
              </span>
            </div>
            <CopyButton
              value={EXAMPLE_PROMPT}
              className="btn btn-ghost h-8 min-h-8 px-2.5 text-xs"
            />
          </header>

          <div className={`relative overflow-hidden ${expanded ? "" : "max-h-80"}`}>
            <pre className="prompt-scroll px-4 py-4 text-[12.5px] leading-relaxed sm:px-5">
              {EXAMPLE_PROMPT}
            </pre>
            {!expanded && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-card to-transparent"
              />
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3 sm:px-5">
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
              className="btn btn-ghost h-8 min-h-8 px-2.5 text-xs"
            >
              {expanded ? "Show less" : "View full example"}
              {expanded ? (
                <ChevronUp className="h-3.5 w-3.5" aria-hidden />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" aria-hidden />
              )}
            </button>
            <Link
              href="/examples"
              className="text-xs font-medium text-brand underline-offset-4 hover:underline"
            >
              More examples
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
