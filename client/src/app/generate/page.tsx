"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, ShieldCheck, Trash2 } from "lucide-react";
import { StepWizard } from "@/components/wizard/StepWizard";
import { PromptViewer } from "@/components/common/PromptViewer";
import { addToHistory } from "@/components/HistorySidebar";
import { buildPrompt } from "@/lib/promptBuilder";
import { DELIVERABLES, formatPrice } from "@/lib/product";
import type { FormState } from "@/lib/types";
import { getDefaultFormState } from "@/lib/types";
import {
  clearFormAndUserStorage,
  loadFormFromStorage,
  loadGeneratedPrompt,
  loadUserFromStorage,
  saveFormToStorage,
  saveGeneratedPrompt,
  saveLastOrder,
  saveUserToStorage,
} from "@/lib/formStorage";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function GeneratePage() {
  const [form, setForm] = useState<FormState>(getDefaultFormState);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setForm(loadFormFromStorage());
    const user = loadUserFromStorage();
    setFullName(user.fullName);
    setEmail(user.email);
    const saved = loadGeneratedPrompt();
    if (saved?.trim()) setGeneratedPrompt(saved.trim());
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    saveTimeout.current = setTimeout(() => saveFormToStorage(form), 400);
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [form, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;
    const timer = setTimeout(() => saveUserToStorage({ fullName, email }), 400);
    return () => clearTimeout(timer);
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
    saveGeneratedPrompt(prompt);
    addToHistory({
      id: crypto.randomUUID(),
      title:
        [form.primaryKw, form.pageType].filter(Boolean).join(" — ") ||
        "Untitled prompt",
      prompt,
      createdAt: new Date().toISOString(),
    });
    requestAnimationFrame(() => {
      document
        .getElementById("result")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [form]);

  const handleCheckout = async () => {
    const trimmedEmail = email.trim();
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setEmailError("Enter a valid email — this is where your prompt is delivered.");
      document.getElementById("checkout-email")?.focus();
      return;
    }
    setEmailError(null);
    setCheckoutError(null);
    setIsRedirecting(true);

    try {
      const response = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: generatedPrompt.trim(),
          email: trimmedEmail,
          fullName: fullName.trim() || undefined,
          brandName: form.brandName.trim() || undefined,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.checkoutUrl) {
        setCheckoutError(
          typeof data?.error === "string"
            ? data.error
            : "Could not start checkout. Please try again."
        );
        setIsRedirecting(false);
        return;
      }

      saveLastOrder({
        orderId: data.orderId,
        email: trimmedEmail,
        brandName: form.brandName.trim(),
        createdAt: new Date().toISOString(),
      });
      window.location.href = data.checkoutUrl;
    } catch {
      setCheckoutError("Network error. Check your connection and try again.");
      setIsRedirecting(false);
    }
  };

  const handleClearAll = () => {
    setForm(getDefaultFormState());
    setFullName("");
    setEmail("");
    setGeneratedPrompt("");
    setCheckoutError(null);
    setEmailError(null);
    clearFormAndUserStorage();
  };

  return (
    <div className="shell py-10 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="pill">Step 1 — build your prompt</span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Describe your page
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Everything you enter stays in your browser until you choose to
              continue. Only the two required fields are strictly needed — the
              rest sharpen the output.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClearAll}
            className="btn btn-ghost"
            aria-label="Clear every field and the saved draft"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            Clear all
          </button>
        </header>

        <div className="mt-8">
          <StepWizard form={form} update={update} onGenerate={handleGenerate} />
        </div>

        {generatedPrompt && (
          <section id="result" className="mt-16 scroll-mt-24">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <span className="pill">Step 2 — your prompt</span>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight">
                  Preview
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Read it, copy it, and download the formats you need.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <PromptViewer
                prompt={generatedPrompt}
                brandName={form.brandName}
                fullName={fullName}
                email={email}
              />
            </div>

            <div className="card-surface mt-10 overflow-hidden">
              <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
                <div className="border-b border-border p-6 md:border-b-0 md:border-r sm:p-8">
                  <h3 className="text-lg font-semibold tracking-tight">
                    Step 3 — get it delivered
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    We email your prompt as a PDF and a Markdown file, and keep a
                    permanent link you can reopen any time.
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="checkout-name" className="field-label">
                        Name
                      </label>
                      <input
                        id="checkout-name"
                        type="text"
                        autoComplete="name"
                        className="field-control"
                        placeholder="Jane Doe"
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="checkout-email" className="field-label">
                        Email <span className="text-destructive">*</span>
                      </label>
                      <input
                        id="checkout-email"
                        type="email"
                        autoComplete="email"
                        className="field-control"
                        placeholder="jane@company.com"
                        value={email}
                        aria-invalid={Boolean(emailError) || undefined}
                        aria-describedby={emailError ? "checkout-email-error" : undefined}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          if (emailError) setEmailError(null);
                        }}
                      />
                      {emailError && (
                        <p id="checkout-email-error" className="field-error" role="alert">
                          {emailError}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={isRedirecting || !generatedPrompt.trim()}
                    className="btn btn-brand btn-lg mt-6 w-full"
                  >
                    {isRedirecting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        Opening secure checkout…
                      </>
                    ) : (
                      <>
                        Continue to checkout — {formatPrice()}
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </>
                    )}
                  </button>

                  {checkoutError && (
                    <p className="field-error mt-3" role="alert">
                      {checkoutError}
                    </p>
                  )}

                  <p className="field-hint mt-3 flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-brand" aria-hidden />
                    Hosted checkout. Card details never reach our servers.
                  </p>
                </div>

                <div className="bg-surface-muted p-6 sm:p-8">
                  <h4 className="field-label">Included</h4>
                  <ul className="mt-4 space-y-2.5">
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
                  <p className="field-hint mt-6">
                    Questions first?{" "}
                    <Link href="/help" className="text-brand underline-offset-4 hover:underline">
                      Read the help page
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
