"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Briefcase, Search, BarChart3, FileText } from "lucide-react";

export function Hero() {
  const steps = [
    { label: "Project", icon: Briefcase },
    { label: "Keywords", icon: Search },
    { label: "Strategy", icon: BarChart3 },
    { label: "Prompt", icon: FileText },
  ];

  return (
    <section className="relative overflow-hidden pb-8 pt-16 sm:pt-24">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-linear-to-b from-primary/5 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-3xl px-6 text-center sm:px-8">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-green-500" />
          AI-powered SEO strategy builder
        </div>

        <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl sm:leading-tight md:text-6xl lg:text-8xl">
          <span className="block">One prompt,</span>
          <span className="block">Full SEO plan</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-sm text-muted-foreground sm:text-base">
          Describe your project &rarr; get a complete SEO plan including
          keywords, content structure, metadata, and optimization instructions.
        </p>

        <div className="mt-10 flex flex-nowrap items-center justify-center gap-3 sm:gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="flex flex-col items-center gap-1.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-card shadow-sm sm:h-12 sm:w-12">
                  <Icon className="h-4 w-4 text-foreground/70 sm:h-5 sm:w-5" />
                </span>
                <span className="text-[10px] font-medium text-muted-foreground sm:text-xs">
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/generate"
            className="inline-flex min-h-11 min-w-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-medium text-background shadow-lg shadow-foreground/10 transition-all hover:opacity-90 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Generate your free SEO prompt"
          >
            Generate SEO Prompt
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <p className="mt-8 text-xs text-muted-foreground/70">
          Trusted by founders, indie hackers, and SEO teams.
        </p>
      </div>
    </section>
  );
}
