"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Loader2, Lock, ShieldCheck, X } from "lucide-react";
import { DELIVERABLES, formatPrice } from "@/lib/product";

interface ContactDialogProps {
  open: boolean;
  fullName: string;
  email: string;
  emailError: string | null;
  submitError: string | null;
  submitting: boolean;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

/**
 * The only thing standing between "Generate" and checkout. The prompt itself is
 * never rendered here — it is built server-side on the order and delivered once
 * the payment is confirmed.
 */
export function ContactDialog({
  open,
  fullName,
  email,
  emailError,
  submitError,
  submitting,
  onFullNameChange,
  onEmailChange,
  onClose,
  onSubmit,
}: ContactDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) onClose();
    };
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => firstFieldRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, submitting, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-end justify-center bg-black/55 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (!submitting && !panelRef.current?.contains(event.target as Node)) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-dialog-title"
        className="animate-fade-up max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border bg-card shadow-2xl sm:rounded-3xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-border p-6">
          <div>
            <span className="pill">
              <Lock className="h-3.5 w-3.5" aria-hidden />
              Last step
            </span>
            <h2 id="contact-dialog-title" className="mt-3 text-xl font-semibold tracking-tight">
              Where should we send it?
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Your prompt is built and delivered after payment — by email, and on a
              permanent link you can reopen any time.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="btn btn-ghost h-9 w-9 shrink-0 px-0"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </header>

        <form
          className="p-6"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="checkout-name" className="field-label">
                Name
              </label>
              <input
                ref={firstFieldRef}
                id="checkout-name"
                name="name"
                type="text"
                autoComplete="name"
                className="field-control"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(event) => onFullNameChange(event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="checkout-email" className="field-label">
                Email <span className="text-destructive">*</span>
              </label>
              <input
                id="checkout-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                className="field-control"
                placeholder="jane@company.com"
                value={email}
                aria-invalid={Boolean(emailError) || undefined}
                aria-describedby={emailError ? "checkout-email-error" : undefined}
                onChange={(event) => onEmailChange(event.target.value)}
              />
              {emailError && (
                <p id="checkout-email-error" className="field-error" role="alert">
                  {emailError}
                </p>
              )}
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn btn-brand btn-lg mt-6 w-full">
            {submitting ? (
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

          {submitError && (
            <p className="field-error mt-3" role="alert">
              {submitError}
            </p>
          )}

          <p className="field-hint mt-3 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-brand" aria-hidden />
            Hosted checkout. Card details never reach our servers.
          </p>

          <div className="mt-6 border-t border-border pt-5">
            <h3 className="field-label">What you get</h3>
            <ul className="mt-3 space-y-2">
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
          </div>
        </form>
      </div>
    </div>
  );
}
