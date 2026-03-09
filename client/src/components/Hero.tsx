"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  const steps = ["Project", "Keywords", "Strategy", "Prompt"];

  return (
    <section className="relative overflow-hidden pb-8 pt-16 sm:pt-24">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-linear-to-b from-primary/5 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" />
          AI-powered SEO strategy builder
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Generate Complete SEO
          <br />
          Strategies in{" "}
          <span className="bg-linear-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            One Prompt
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
          Describe your project &rarr; get a complete SEO plan including
          keywords, content structure, metadata, and optimization instructions.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-medium sm:text-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
                  {i + 1}
                </span>
                {step}
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/generate"
            className="inline-flex min-h-11 min-w-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-medium text-background shadow-lg shadow-foreground/10 transition-all hover:opacity-90 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Generate SEO Prompt
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="mt-8 text-xs text-muted-foreground/70">
          Trusted by founders, indie hackers, and SEO teams.
        </p>
      </div>
    </section>
  );
}
