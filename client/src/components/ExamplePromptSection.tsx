"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const EXAMPLE_PROMPT = `You are a world-class full-stack SEO engineer and Next.js expert. Implement a COMPLETE, production-ready SEO setup for the following project.

══════════════════════════════════════════
PROJECT OVERVIEW
══════════════════════════════════════════
Brand Name     : DevHire
Domain         : https://devhire.io
Project Type   : SaaS Landing Page
Tech Stack     : Next.js (App Router) + TypeScript + Tailwind
Description    : Platform to hire developers directly from GitHub
Target Audience: CTOs, HR Leaders, Engineering Managers

══════════════════════════════════════════
1. SEO STRATEGY & KEYWORD MAPPING
══════════════════════════════════════════
Primary Keyword  : best project management tool for startups
Secondary Keywords: project management tool for startups, project management software for startups, project management tool for small businesses
Search Intent    : Commercial (user wants to evaluate / buy)
Competitors      : asana.com, notion.so, trello.com

Rules:
- Map exactly 1 primary keyword per page
- Use secondary keywords as LSI/supporting terms
- Plan content clusters: 1 pillar page + child pages under /blog/
- Design clean URL structure: /hire-developers-from-github, /blog/[slug]
...`;

export function ExamplePromptSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="example-output" className="scroll-mt-20 pb-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h2 className="text-center text-2xl font-bold tracking-tight">
          Example Output
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Here&apos;s what a generated SEO prompt looks like
        </p>

        <div className="relative mt-8 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs font-medium text-muted-foreground">
                SEO Prompt Preview
              </span>
            </div>
            <span className="font-mono text-xs text-muted-foreground/60">
              devhire.io
            </span>
          </div>

          <div className={`relative ${expanded ? "" : "max-h-64"} overflow-hidden`}>
            <pre className="whitespace-pre-wrap p-4 font-mono text-xs leading-relaxed text-foreground/80">
              {EXAMPLE_PROMPT}
            </pre>
            {!expanded && (
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-card to-transparent" />
            )}
          </div>

          <div className="flex justify-center border-t border-border/60 py-3">
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {expanded ? (
                <>
                  Show less <ChevronUp className="h-3.5 w-3.5" />
                </>
              ) : (
                <>
                  View full example <ChevronDown className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
