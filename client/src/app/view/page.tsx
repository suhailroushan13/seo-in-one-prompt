"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { loadViewPrompt, loadPendingPrompt, loadGeneratedPrompt } from "@/lib/formStorage";

export default function ViewPromptPage() {
  const [prompt, setPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fromView = loadViewPrompt();
    if (fromView?.trim()) {
      setPrompt(fromView.trim());
      return;
    }
    const pending = loadPendingPrompt();
    if (pending?.prompt?.trim()) {
      setPrompt(pending.prompt.trim());
      return;
    }
    const generated = loadGeneratedPrompt();
    if (generated?.trim()) {
      setPrompt(generated.trim());
    } else {
      setPrompt("");
    }
  }, []);

  const handleCopy = async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  if (prompt === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-muted-foreground">No prompt to display.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-10 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-3 py-3 sm:px-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
            <span className="truncate text-sm font-medium text-foreground">
              {copied ? "Copied!" : "Copy prompt"}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border bg-muted/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={copied ? "Copied" : "Copy prompt"}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600 dark:text-green-400" aria-hidden />
              ) : (
                <Copy className="h-4 w-4" aria-hidden />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-3 py-6 sm:px-6 sm:py-8">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-foreground">
            {prompt}
          </pre>
        </div>
      </main>
    </div>
  );
}
