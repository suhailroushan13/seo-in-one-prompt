"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Wand2 } from "lucide-react";
import { EXAMPLE_ROWS } from "@/lib/exampleForm";

interface ExampleCardProps {
  onFill: () => void;
  filled: boolean;
}

/**
 * Shown above the wizard: every placeholder value in one place, plus the button
 * that drops them into the form. Filling is a preview only — the generator stays
 * locked until the buyer replaces the example with their own project.
 */
export function ExampleCard({ onFill, filled }: ExampleCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className="card-flat overflow-hidden" aria-labelledby="example-card-title">
      <div className="flex flex-wrap items-start justify-between gap-4 p-5 sm:p-6">
        <div className="min-w-0">
          <span className="pill">Example</span>
          <h2 id="example-card-title" className="mt-3 text-base font-semibold tracking-tight">
            Not sure what goes where?
          </h2>
          <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Every field below is pre-filled with placeholder text from one worked
            example — a SaaS landing page for <strong className="font-medium text-foreground">DevHire</strong>.
            Load it to see the shape of a good answer, then swap in your own project.
          </p>
        </div>
        <button
          type="button"
          onClick={onFill}
          className="btn btn-outline shrink-0"
          aria-pressed={filled}
        >
          <Wand2 className="h-4 w-4" aria-hidden />
          {filled ? "Example loaded" : "Fill the example"}
        </button>
      </div>

      <div className="border-t border-border px-5 sm:px-6">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="example-values"
          className="flex w-full items-center justify-between gap-3 py-3 text-left text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {open ? "Hide the example values" : "See all example values"}
          {open ? (
            <ChevronUp className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" aria-hidden />
          )}
        </button>
      </div>

      {open && (
        <dl
          id="example-values"
          className="grid gap-x-6 gap-y-3 border-t border-border p-5 sm:grid-cols-2 sm:p-6"
        >
          {EXAMPLE_ROWS.map((row) => (
            <div key={row.label} className="min-w-0">
              <dt className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                {row.label}
              </dt>
              <dd className="mt-0.5 break-words text-sm text-foreground">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
