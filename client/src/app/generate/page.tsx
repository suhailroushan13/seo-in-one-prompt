"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { StepWizard } from "@/components/wizard/StepWizard";
import { ExampleCard } from "@/components/generate/ExampleCard";
import { ContactDialog } from "@/components/generate/ContactDialog";
import { buildPrompt } from "@/lib/promptBuilder";
import { EXAMPLE_FORM, isExampleForm } from "@/lib/exampleForm";
import type { FormState } from "@/lib/types";
import { getDefaultFormState } from "@/lib/types";
import {
  clearFormAndUserStorage,
  loadFormFromStorage,
  loadUserFromStorage,
  saveFormToStorage,
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
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setForm(loadFormFromStorage());
    const user = loadUserFromStorage();
    setFullName(user.fullName);
    setEmail(user.email);
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    saveTimeout.current = setTimeout(() => saveFormToStorage(form), 400);
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [form, hasHydrated]);

  // Name, email, and the domain are remembered so the next visit starts filled in.
  useEffect(() => {
    if (!hasHydrated) return;
    const timer = setTimeout(
      () => saveUserToStorage({ fullName, email, website: form.domainName }),
      400
    );
    return () => clearTimeout(timer);
  }, [fullName, email, form.domainName, hasHydrated]);

  const update = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  /** The example is a preview: it can be loaded and read, but never bought. */
  const isExample = useMemo(() => isExampleForm(form), [form]);

  const handleFillExample = useCallback(() => {
    setForm({ ...EXAMPLE_FORM });
    document.getElementById("wizard")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleGenerate = useCallback(() => {
    setCheckoutError(null);
    setEmailError(null);
    setDialogOpen(true);
  }, []);

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
          prompt: buildPrompt(form),
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
    setCheckoutError(null);
    setEmailError(null);
    clearFormAndUserStorage();
  };

  return (
    <div className="shell py-10 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="pill">Describe your page</span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Build your SEO prompt
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Everything you enter stays in your browser until you continue to
              checkout. Only the two required fields are strictly needed — the rest
              sharpen the output.
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
          <ExampleCard onFill={handleFillExample} filled={isExample} />
        </div>

        <div className="mt-6">
          <StepWizard
            form={form}
            update={update}
            onGenerate={handleGenerate}
            generateDisabled={isExample}
            disabledReason="This is the example project. Change any field to your own details to unlock Generate."
          />
        </div>
      </div>

      <ContactDialog
        open={dialogOpen}
        fullName={fullName}
        email={email}
        emailError={emailError}
        submitError={checkoutError}
        submitting={isRedirecting}
        onFullNameChange={setFullName}
        onEmailChange={(value) => {
          setEmail(value);
          if (emailError) setEmailError(null);
        }}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCheckout}
      />
    </div>
  );
}
