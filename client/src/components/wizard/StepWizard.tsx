"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Lock, Sparkles } from "lucide-react";
import { PageTypeCards } from "@/components/inputs/PageTypeCards";
import { TagInput } from "@/components/inputs/TagInput";
import { SegmentControl } from "@/components/inputs/SegmentControl";
import { KeywordSuggestions } from "@/components/inputs/KeywordSuggestions";
import { Field, describedById } from "@/components/wizard/Field";
import { StepProgress } from "@/components/wizard/StepProgress";
import { example } from "@/lib/exampleForm";
import type { FormState } from "@/lib/types";
import {
  ANALYTICS_OPTIONS,
  CDN_OPTIONS,
  CONTENT_LENGTH_OPTIONS,
  CONTENT_STYLE_OPTIONS,
  CONTENT_TONE_OPTIONS,
  IMAGE_FORMAT_OPTIONS,
  LOAD_TARGET_OPTIONS,
  PAGE_TYPE_OPTIONS,
  RENDERING_OPTIONS,
  SEARCH_INTENT_OPTIONS,
  SITEMAP_OPTIONS,
  STRUCTURED_DATA_OPTIONS,
  TECH_OPTIONS,
  TITLE_FORMAT_OPTIONS,
} from "@/lib/types";

interface StepWizardProps {
  form: FormState;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  onGenerate: () => void;
  /** True while the form still holds the untouched example project. */
  generateDisabled?: boolean;
  disabledReason?: string;
}

const STEPS = [
  { title: "Project", subtitle: "Who you are and what you are optimising" },
  { title: "Keywords", subtitle: "The terms this page should win" },
  { title: "Content", subtitle: "How the page should read" },
  { title: "Technical", subtitle: "Rendering, schema, and performance" },
] as const;

type FieldErrors = Partial<Record<keyof FormState, string>>;

/** Accepts `example.com`, `www.example.com`, or a full URL. */
function isValidDomain(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  try {
    const host = new URL(
      /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    ).hostname;
    if (!host || host.length > 253) return false;
    if (host === "localhost" || host.endsWith(".localhost")) return true;
    const parts = host.split(".");
    if (parts.length < 2 || parts.some((part) => !part.length)) return false;
    return parts[parts.length - 1].length >= 2 && /^[a-z0-9.-]+$/i.test(host);
  } catch {
    return false;
  }
}

function validateStep(step: number, form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (step === 1) {
    if (!form.brandName.trim()) errors.brandName = "Add the brand or product name.";
    if (!form.domainName.trim()) errors.domainName = "Add the domain this page lives on.";
    else if (!isValidDomain(form.domainName))
      errors.domainName = "That does not look like a domain. Try example.com.";
  }
  if (step === 2) {
    if (!form.primaryKw.trim())
      errors.primaryKw = "One primary keyword is required — it anchors the whole prompt.";
  }
  return errors;
}

export function StepWizard({
  form,
  update,
  onGenerate,
  generateDisabled = false,
  disabledReason,
}: StepWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [furthestStep, setFurthestStep] = useState(1);
  const [errors, setErrors] = useState<FieldErrors>({});

  const labels = useMemo(() => STEPS.map((step) => step.title), []);
  const active = STEPS[currentStep - 1];

  const clearError = (key: keyof FormState) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    update(key, value);
    clearError(key);
  };

  const focusFirstError = (found: FieldErrors) => {
    const first = Object.keys(found)[0];
    if (!first) return;
    requestAnimationFrame(() => {
      document.getElementById(`field-${first}`)?.focus();
    });
  };

  const goTo = (step: number) => {
    const clamped = Math.min(Math.max(step, 1), STEPS.length);
    setCurrentStep(clamped);
    setFurthestStep((prev) => Math.max(prev, clamped));
    document.getElementById("wizard")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleContinue = () => {
    const found = validateStep(currentStep, form);
    setErrors(found);
    if (Object.keys(found).length) {
      focusFirstError(found);
      return;
    }
    goTo(currentStep + 1);
  };

  const handleGenerate = () => {
    if (generateDisabled) return;
    for (const step of [1, 2]) {
      const found = validateStep(step, form);
      if (Object.keys(found).length) {
        setErrors(found);
        goTo(step);
        focusFirstError(found);
        return;
      }
    }
    setErrors({});
    onGenerate();
  };

  return (
    <div id="wizard" className="scroll-mt-24">
      <div className="card-surface sticky top-16 z-20 px-4 py-3.5 sm:px-5">
        <StepProgress
          currentStep={currentStep}
          furthestStep={furthestStep}
          stepLabels={labels}
          onStepClick={goTo}
        />
      </div>

      <section
        className="card-surface mt-4 p-5 sm:p-7"
        aria-labelledby="wizard-step-heading"
      >
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="field-label">
              Step {currentStep} of {STEPS.length}
            </p>
            <h2 id="wizard-step-heading" className="mt-1 text-xl font-semibold tracking-tight">
              {active.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{active.subtitle}</p>
          </div>
          <span className="pill">
            {currentStep} / {STEPS.length}
          </span>
        </header>

        <div className="mt-7 space-y-6">
          {currentStep === 1 && <StepProject form={form} set={set} errors={errors} />}
          {currentStep === 2 && <StepKeywords form={form} set={set} errors={errors} />}
          {currentStep === 3 && <StepContent form={form} set={set} />}
          {currentStep === 4 && <StepTechnical form={form} set={set} />}
        </div>
      </section>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => goTo(currentStep - 1)}
          disabled={currentStep === 1}
          className="btn btn-outline order-2 w-full sm:order-1 sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back
        </button>

        <div className="order-1 flex flex-col gap-2 sm:order-2 sm:flex-row">
          {currentStep < STEPS.length && (
            <button type="button" onClick={handleContinue} className="btn btn-solid w-full sm:w-auto">
              Continue
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          )}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generateDisabled}
            aria-describedby={generateDisabled && disabledReason ? "generate-disabled" : undefined}
            className="btn btn-brand w-full sm:w-auto"
          >
            {generateDisabled ? (
              <Lock className="h-4 w-4" aria-hidden />
            ) : (
              <Sparkles className="h-4 w-4" aria-hidden />
            )}
            Generate prompt
          </button>
        </div>
      </div>

      {generateDisabled && disabledReason && (
        <p id="generate-disabled" className="field-hint mt-3 text-right">
          {disabledReason}
        </p>
      )}
    </div>
  );
}

type Setter = <K extends keyof FormState>(key: K, value: FormState[K]) => void;

function Select({
  id,
  value,
  onChange,
  options,
  render,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  render?: (option: string) => string;
}) {
  return (
    <select
      id={id}
      className="field-control cursor-pointer"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {render ? render(option) : option}
        </option>
      ))}
    </select>
  );
}

function StepProject({
  form,
  set,
  errors,
}: {
  form: FormState;
  set: Setter;
  errors: FieldErrors;
}) {
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id="field-brandName"
          label="Brand name"
          required
          error={errors.brandName}
          hint="Used in titles, schema, and the delivered PDF."
        >
          <input
            id="field-brandName"
            type="text"
            name="organization"
            autoComplete="organization"
            className="field-control"
            placeholder={`e.g. ${example("brandName")}`}
            value={form.brandName}
            aria-invalid={Boolean(errors.brandName) || undefined}
            aria-describedby={describedById("field-brandName", Boolean(errors.brandName))}
            onChange={(event) => set("brandName", event.target.value)}
          />
        </Field>

        <Field
          id="field-domainName"
          label="Domain"
          required
          error={errors.domainName}
          hint="Canonical URLs and sitemap entries are built from this."
        >
          <div
            className={`flex min-h-11 items-stretch overflow-hidden rounded-lg border transition-colors focus-within:border-brand focus-within:ring-2 focus-within:ring-brand-ring ${
              errors.domainName ? "border-destructive" : "border-[var(--input)]"
            }`}
          >
            <span className="flex select-none items-center border-r border-border bg-surface-muted px-3 text-xs font-medium text-muted-foreground">
              https://
            </span>
            <input
              id="field-domainName"
              type="text"
              inputMode="url"
              autoComplete="url"
              className="w-full bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
              placeholder={example("domainName").replace(/^https?:\/\//i, "")}
              value={form.domainName.replace(/^https?:\/\//i, "")}
              aria-invalid={Boolean(errors.domainName) || undefined}
              aria-describedby={describedById("field-domainName", Boolean(errors.domainName))}
              onChange={(event) => {
                const host = event.target.value.trim().replace(/^https?:\/\//i, "");
                set("domainName", host ? `https://${host}` : "");
              }}
            />
          </div>
        </Field>
      </div>

      <Field
        id="field-projectDesc"
        label="Project description"
        hint="One or two lines. What does this product actually do?"
      >
        <textarea
          id="field-projectDesc"
          rows={3}
          className="field-control min-h-24 resize-y py-2.5"
          placeholder={`e.g. ${example("projectDesc")}`}
          value={form.projectDesc}
          aria-describedby="field-projectDesc-hint"
          onChange={(event) => set("projectDesc", event.target.value)}
        />
      </Field>

      <Field id="field-pageType" label="Page type" asGroup>
        <PageTypeCards
          options={PAGE_TYPE_OPTIONS}
          value={form.pageType}
          onChange={(value) => set("pageType", value)}
          labelledBy="field-pageType-label"
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="field-techStack" label="Tech stack">
          <Select
            id="field-techStack"
            value={form.techStack}
            onChange={(value) => set("techStack", value)}
            options={TECH_OPTIONS}
            render={(option) => (option === "custom" ? "Custom" : option)}
          />
        </Field>

        {form.techStack === "custom" && (
          <Field id="field-customStack" label="Custom stack">
            <input
              id="field-customStack"
              type="text"
              autoComplete="off"
              className="field-control"
              placeholder="e.g. React Native, Node.js"
              value={form.customStack}
              onChange={(event) => set("customStack", event.target.value)}
            />
          </Field>
        )}
      </div>
    </>
  );
}

function StepKeywords({
  form,
  set,
  errors,
}: {
  form: FormState;
  set: Setter;
  errors: FieldErrors;
}) {
  return (
    <>
      <Field
        id="field-primaryKw"
        label="Primary keyword"
        required
        error={errors.primaryKw}
        hint="Exactly one. Every other section is mapped to it."
      >
        <KeywordSuggestions
          id="field-primaryKw"
          value={form.primaryKw}
          onChange={(value) => set("primaryKw", value)}
          placeholder={`e.g. ${example("primaryKw")}`}
          invalid={Boolean(errors.primaryKw)}
          describedBy={describedById("field-primaryKw", Boolean(errors.primaryKw))}
        />
      </Field>

      <Field
        id="field-secondaryKw"
        label="Secondary keywords"
        hint="Press Enter after each. Used as supporting and LSI terms."
      >
        <TagInput
          id="field-secondaryKw"
          value={form.secondaryKw}
          onChange={(value) => set("secondaryKw", value)}
          placeholder={`e.g. ${example("secondaryKw")}`}
        />
      </Field>

      <Field id="field-searchIntent" label="Search intent" asGroup>
        <SegmentControl
          options={SEARCH_INTENT_OPTIONS}
          value={form.searchIntent}
          onChange={(value) => set("searchIntent", value)}
          labelledBy="field-searchIntent-label"
        />
      </Field>

      <Field
        id="field-audience"
        label="Target audience"
        hint="Shapes tone, reading level, and the FAQ block."
      >
        <input
          id="field-audience"
          type="text"
          className="field-control"
          autoComplete="off"
          placeholder={`e.g. ${example("audience")}`}
          value={form.audience}
          aria-describedby="field-audience-hint"
          onChange={(event) => set("audience", event.target.value)}
        />
      </Field>
    </>
  );
}

function StepContent({ form, set }: { form: FormState; set: Setter }) {
  return (
    <>
      <Field
        id="field-competitors"
        label="Competitor domains"
        hint="Comma separated. The prompt uses them for gap analysis."
      >
        <input
          id="field-competitors"
          type="text"
          className="field-control"
          autoComplete="off"
          placeholder={`e.g. ${example("competitors")}`}
          value={form.competitors}
          aria-describedby="field-competitors-hint"
          onChange={(event) => set("competitors", event.target.value)}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="field-contentStyle" label="Content style">
          <Select
            id="field-contentStyle"
            value={form.contentStyle}
            onChange={(value) => set("contentStyle", value)}
            options={CONTENT_STYLE_OPTIONS}
          />
        </Field>
        <Field id="field-contentTone" label="Tone of writing">
          <Select
            id="field-contentTone"
            value={form.contentTone}
            onChange={(value) => set("contentTone", value)}
            options={CONTENT_TONE_OPTIONS}
          />
        </Field>
      </div>

      <Field id="field-contentLength" label="Content length">
        <Select
          id="field-contentLength"
          value={form.contentLength}
          onChange={(value) => set("contentLength", value)}
          options={CONTENT_LENGTH_OPTIONS}
        />
      </Field>

      <Field
        id="field-extraNotes"
        label="Extra notes"
        hint="Anything the prompt must account for — constraints, priorities, existing content."
      >
        <textarea
          id="field-extraNotes"
          rows={3}
          className="field-control min-h-24 resize-y py-2.5"
          placeholder={`e.g. ${example("extraNotes")}`}
          value={form.extraNotes}
          aria-describedby="field-extraNotes-hint"
          onChange={(event) => set("extraNotes", event.target.value)}
        />
      </Field>
    </>
  );
}

function StepTechnical({ form, set }: { form: FormState; set: Setter }) {
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="field-titleFormat" label="Title format">
          <Select
            id="field-titleFormat"
            value={form.titleFormat}
            onChange={(value) => set("titleFormat", value)}
            options={TITLE_FORMAT_OPTIONS}
          />
        </Field>
        <Field id="field-rendering" label="Rendering strategy">
          <Select
            id="field-rendering"
            value={form.rendering}
            onChange={(value) => set("rendering", value)}
            options={RENDERING_OPTIONS}
            render={(option) => option.split("(")[0].trim()}
          />
        </Field>
        <Field id="field-structuredData" label="Structured data">
          <Select
            id="field-structuredData"
            value={form.structuredData}
            onChange={(value) => set("structuredData", value)}
            options={STRUCTURED_DATA_OPTIONS}
            render={(option) => (option === "none" ? "None" : option)}
          />
        </Field>
        <Field id="field-sitemap" label="Sitemap">
          <Select
            id="field-sitemap"
            value={form.sitemap}
            onChange={(value) => set("sitemap", value)}
            options={SITEMAP_OPTIONS}
            render={(option) =>
              option.includes("dynamic")
                ? "Dynamic XML"
                : option.includes("static")
                  ? "Static file"
                  : "next-sitemap"
            }
          />
        </Field>
        <Field id="field-imageFormat" label="Image format">
          <Select
            id="field-imageFormat"
            value={form.imageFormat}
            onChange={(value) => set("imageFormat", value)}
            options={IMAGE_FORMAT_OPTIONS}
          />
        </Field>
        <Field id="field-loadTarget" label="Load target">
          <Select
            id="field-loadTarget"
            value={form.loadTarget}
            onChange={(value) => set("loadTarget", value)}
            options={LOAD_TARGET_OPTIONS}
          />
        </Field>
        <Field id="field-cdn" label="CDN">
          <Select
            id="field-cdn"
            value={form.cdn}
            onChange={(value) => set("cdn", value)}
            options={CDN_OPTIONS}
          />
        </Field>
        <Field id="field-analytics" label="Analytics">
          <Select
            id="field-analytics"
            value={form.analytics}
            onChange={(value) => set("analytics", value)}
            options={ANALYTICS_OPTIONS}
            render={(option) => (option === "none" ? "None" : option)}
          />
        </Field>
      </div>

      <Field
        id="field-robotsRules"
        label="robots.txt rules"
        hint="Paths to disallow, or leave blank for sensible defaults."
      >
        <input
          id="field-robotsRules"
          type="text"
          className="field-control"
          autoComplete="off"
          placeholder={`e.g. ${example("robotsRules")}`}
          value={form.robotsRules}
          aria-describedby="field-robotsRules-hint"
          onChange={(event) => set("robotsRules", event.target.value)}
        />
      </Field>
    </>
  );
}
