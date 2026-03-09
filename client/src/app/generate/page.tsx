"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { StepWizard } from "@/components/wizard/StepWizard";
import { HistorySidebar, addToHistory } from "@/components/HistorySidebar";
import { buildPrompt } from "@/lib/promptBuilder";
import type { FormState } from "@/lib/types";
import { getDefaultFormState } from "@/lib/types";
import {
  loadFormFromStorage,
  saveFormToStorage,
  loadUserFromStorage,
  saveUserToStorage,
  clearFormAndUserStorage,
  savePendingPrompt,
} from "@/lib/formStorage";
import { ArrowLeft, ArrowRight, Copy, Download, Check, Trash2 } from "lucide-react";

const NEXT_STEP_URL = "https://dodo.pe/seopromptai";

export default function GeneratePage() {
  const [form, setForm] = useState<FormState>(getDefaultFormState);
  const [hasHydrated, setHasHydrated] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setForm(loadFormFromStorage());
    const user = loadUserFromStorage();
    setFullName(user.fullName);
    setEmail(user.email);
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    saveTimeoutRef.current = setTimeout(() => {
      saveFormToStorage(form);
      saveTimeoutRef.current = null;
    }, 400);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [form, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;
    const t = setTimeout(() => saveUserToStorage({ fullName, email }), 400);
    return () => clearTimeout(t);
  }, [fullName, email, hasHydrated]);

  const update = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleGenerate = useCallback(() => {
    const prompt = buildPrompt(form);
    setGeneratedPrompt(prompt);
    setShowResult(true);

    const title =
      [form.primaryKw, form.pageType].filter(Boolean).join(" — ") ||
      "Untitled Prompt";
    addToHistory({
      id: crypto.randomUUID(),
      title,
      prompt,
      createdAt: new Date().toISOString(),
    });

    setTimeout(() => {
      document
        .getElementById("result-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, [form]);

  const handleLoadFromHistory = (prompt: string) => {
    setGeneratedPrompt(prompt);
    setShowResult(true);
    setTimeout(() => {
      document
        .getElementById("result-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleCopy = useCallback(async () => {
    if (!generatedPrompt) return;
    await navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [generatedPrompt]);

  const handleDownload = useCallback(() => {
    if (!generatedPrompt) return;
    const date = new Date().toISOString().slice(0, 10);
    const blob = new Blob([generatedPrompt], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seo-prompt-${date}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [generatedPrompt]);

  const handleSubmit = async () => {
    if (!generatedPrompt?.trim() || !email?.trim()) return;
    const trimmedEmail = email.trim();
    const trimmedName = fullName?.trim() ?? "";
    savePendingPrompt({
      prompt: generatedPrompt.trim(),
      fullName: trimmedName,
      email: trimmedEmail,
    });
    try {
      const res = await fetch("/api/payment/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: generatedPrompt.trim(),
          email: trimmedEmail,
          fullName: trimmedName || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data?.error ?? "Could not save prompt. Try again.");
        return;
      }
    } catch {
      alert("Could not save prompt. Try again.");
      return;
    }
    window.location.href = NEXT_STEP_URL;
  };

  const handleClearAll = useCallback(() => {
    setForm(getDefaultFormState());
    setFullName("");
    setEmail("");
    setGeneratedPrompt("");
    setShowResult(false);
    clearFormAndUserStorage();
  }, []);

  return (
    <div className="min-h-full">
      <header className="border-b border-border/50 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex min-h-10 min-w-10 cursor-pointer items-center justify-center gap-2 rounded-lg px-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            <span>Back to home</span>
          </Link>
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Clear all fields and local storage"
          >
            <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
            <span>Clear all fields</span>
          </button>
        </div>
      </header>

      <section
        className="px-4 pb-24 pt-8 sm:px-6"
        aria-label="Generate SEO prompt"
      >
        <div className="mx-auto max-w-2xl">
          <div className="space-y-6">
            <StepWizard
              form={form}
              update={update}
              onGenerate={handleGenerate}
            />
            {/* <HistorySidebar onLoad={handleLoadFromHistory} /> */}
          </div>

          {showResult && generatedPrompt && (
            <div
              id="result-section"
              className="mt-12 scroll-mt-24 space-y-8"
              aria-labelledby="result-heading"
            >
              <h2 id="result-heading" className="sr-only">
                Your prompt is ready
              </h2>

              {/* Actions: Copy & Download — always available and clickable */}
              {/* <section
                className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5"
                aria-label="Prompt actions"
              >
                <p className="mb-4 text-sm font-medium text-foreground/90">
                  Your prompt is ready. Copy or save it below.
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex min-h-10 min-w-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-transform hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none"
                    aria-label="Copy prompt to clipboard"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 shrink-0" aria-hidden />
                    ) : (
                      <Copy className="h-4 w-4 shrink-0" aria-hidden />
                    )}
                    <span>{copied ? "Copied" : "Copy prompt"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="inline-flex min-h-10 min-w-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-transparent px-4 py-2.5 text-sm font-medium text-foreground transition-transform hover:bg-muted active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label="Download prompt as Markdown file"
                  >
                    <Download className="h-4 w-4 shrink-0" aria-hidden />
                    <span>Download .md</span>
                  </button>
                </div>
              </section> */}

              {/* Next step form — neutral labels, single primary button */}
              <section
                className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6"
                aria-labelledby="next-step-heading"
              >
                <h3
                  id="next-step-heading"
                  className="text-base font-semibold text-foreground sm:text-lg"
                >
                  Next step
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Enter your name and email to proceed.
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="generate-fullName"
                      className="mb-1.5 block text-sm font-medium text-foreground/80"
                    >
                      Name
                    </label>
                    <input
                      id="generate-fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul"
                      className="h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="generate-email"
                      className="mb-1.5 block text-sm font-medium text-foreground/80"
                    >
                      Email
                    </label>
                    <input
                      id="generate-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. We don't spam you "
                      className="h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!generatedPrompt?.trim() || !email?.trim()}
                    className="inline-flex min-h-11 min-w-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background shadow-md transition-transform duration-200 hover:scale-[1.02] hover:opacity-90 hover:shadow-lg active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    aria-label="Proceed to next step"
                  >
                    <span>Submit</span>
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                  </button>
                </div>
              </section>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
