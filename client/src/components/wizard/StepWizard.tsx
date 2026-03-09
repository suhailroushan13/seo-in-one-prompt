"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight, ArrowLeft, Sparkles, HelpCircle } from "lucide-react";
import { StepProgress } from "./StepProgress";
import { PageTypeCards } from "@/components/inputs/PageTypeCards";
import { TagInput } from "@/components/inputs/TagInput";
import { SegmentControl } from "@/components/inputs/SegmentControl";
import { KeywordSuggestions } from "@/components/inputs/KeywordSuggestions";
import type { FormState } from "@/lib/types";
import {
  TECH_OPTIONS,
  PAGE_TYPE_OPTIONS,
  SEARCH_INTENT_OPTIONS,
  CONTENT_STYLE_OPTIONS,
  CONTENT_TONE_OPTIONS,
  CONTENT_LENGTH_OPTIONS,
  TITLE_FORMAT_OPTIONS,
  RENDERING_OPTIONS,
  STRUCTURED_DATA_OPTIONS,
  SITEMAP_OPTIONS,
  IMAGE_FORMAT_OPTIONS,
  LOAD_TARGET_OPTIONS,
  CDN_OPTIONS,
  ANALYTICS_OPTIONS,
} from "@/lib/types";

interface StepWizardProps {
  form: FormState;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  onGenerate: () => void;
}

const STEP_LABELS = [
  "Project Identity",
  "SEO Keywords",
  "Content Strategy",
  "Output Options",
];

const inputClass =
  "h-9 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";
const labelClass = "mb-1.5 block text-sm font-medium text-foreground/70";
const selectClass =
  "h-9 w-full cursor-pointer rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

const requiredLabelClass = "text-red-500 dark:text-red-400";
const requiredInputClass = "border-red-500 dark:border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500/30 dark:focus-visible:border-red-400 dark:focus-visible:ring-red-400/30";

/** Validates URL or domain (e.g. https://example.com, www.example.com, example.com). */
function isValidDomainOrUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(withProtocol);
    const host = url.hostname;
    if (!host || host.length > 253) return false;
    if (host === "localhost" || host.endsWith(".localhost")) return true;
    const parts = host.split(".");
    if (parts.length < 2 || parts.some((p) => !p.length)) return false;
    const tld = parts[parts.length - 1];
    return tld.length >= 2 && /^[a-z0-9-]+$/i.test(host.replace(/\./g, ""));
  } catch {
    return false;
  }
}

function isStep1Valid(form: FormState): boolean {
  return (
    form.brandName.trim() !== "" &&
    form.domainName.trim() !== "" &&
    isValidDomainOrUrl(form.domainName)
  );
}
function isStep2Valid(form: FormState): boolean {
  return form.primaryKw.trim() !== "";
}

export function StepWizard({ form, update, onGenerate }: StepWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [openSteps, setOpenSteps] = useState<Set<number>>(() => new Set([1]));
  const [attemptedStep1, setAttemptedStep1] = useState(false);
  const [attemptedStep2, setAttemptedStep2] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const scrollToStep = (step: number) => {
    const el = document.getElementById(`wizard-step-${step}`);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const goTo = (step: number) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step);
      setOpenSteps((prev) => new Set(prev).add(step));
    }
  };

  const handleContinue = () => {
    if (currentStep === 1) {
      if (!isStep1Valid(form)) {
        const missing: string[] = [];
        if (!form.brandName.trim()) missing.push("Brand name");
        if (!form.domainName.trim()) missing.push("Domain");
        else if (!isValidDomainOrUrl(form.domainName)) missing.push("Domain (enter a valid URL or domain, e.g. https://example.com or example.com)");
        setAttemptedStep1(true);
        setValidationMessage(missing.length ? `Please fix: ${missing.join("; ")}` : null);
        setOpenSteps((prev) => new Set(prev).add(1));
        scrollToStep(1);
        return;
      }
      setAttemptedStep1(false);
      setValidationMessage(null);
      goTo(2);
    } else if (currentStep === 2) {
      if (!isStep2Valid(form)) {
        setAttemptedStep2(true);
        setValidationMessage("Please enter Primary keyword.");
        setOpenSteps((prev) => new Set(prev).add(2));
        scrollToStep(2);
        return;
      }
      setAttemptedStep2(false);
      setValidationMessage(null);
      goTo(3);
    } else if (currentStep === 3) {
      setValidationMessage(null);
      goTo(4);
    }
  };

  const handleGenerate = () => {
    if (!isStep1Valid(form) || !isStep2Valid(form)) {
      setAttemptedStep1(!isStep1Valid(form));
      setAttemptedStep2(!isStep2Valid(form));
      const missing: string[] = [];
      if (!form.brandName.trim()) missing.push("Brand name");
      if (!form.domainName.trim()) missing.push("Domain");
      else if (!isValidDomainOrUrl(form.domainName)) missing.push("Domain (enter a valid URL or domain)");
      if (!form.primaryKw.trim()) missing.push("Primary keyword");
      setValidationMessage(missing.length ? `Please fix: ${missing.join("; ")}` : null);
      if (!isStep1Valid(form)) {
        goTo(1);
        setOpenSteps((prev) => new Set(prev).add(1));
        scrollToStep(1);
      } else {
        goTo(2);
        setOpenSteps((prev) => new Set(prev).add(2));
        scrollToStep(2);
      }
      return;
    }
    setValidationMessage(null);
    onGenerate();
  };

  const toggleStep = (step: number) => {
    setOpenSteps((prev) => {
      const next = new Set(prev);
      if (next.has(step)) next.delete(step);
      else next.add(step);
      return next;
    });
  };

  const isStepOpen = (step: number) => openSteps.has(step);

  const brandInvalid = attemptedStep1 && form.brandName.trim() === "";
  const domainInvalid =
    attemptedStep1 &&
    (form.domainName.trim() === "" || !isValidDomainOrUrl(form.domainName));
  const primaryKwInvalid = attemptedStep2 && form.primaryKw.trim() === "";

  return (
    <div className="space-y-6" id="wizard">
      <StepProgress
        currentStep={currentStep}
        totalSteps={4}
        stepLabels={STEP_LABELS}
        onStepClick={goTo}
      />

      {/* Step 1: Project Identity */}
      <StepPanel
        id="wizard-step-1"
        step={1}
        currentStep={currentStep}
        isOpen={isStepOpen(1)}
        onToggle={() => toggleStep(1)}
        title="Project Identity"
        subtitle="Tell us about your project"
        validationMessage={currentStep === 1 ? validationMessage : null}
      >
        <div className="space-y-5">
          <div className="flex justify-end">
            <Link
              href="/help#step-1"
              className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              Need help?
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={`${labelClass} ${brandInvalid ? requiredLabelClass : ""}`}>
                Brand name <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <input
                type="text"
                className={`${inputClass} ${brandInvalid ? requiredInputClass : ""}`}
                placeholder="e.g. Zomato"
                value={form.brandName}
                onChange={(e) => update("brandName", e.target.value)}
              />
            </div>
            <div>
              <label className={`${labelClass} ${domainInvalid ? requiredLabelClass : ""}`}>
                Domain <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <input
                type="url"
                className={`${inputClass} ${domainInvalid ? requiredInputClass : ""}`}
                placeholder="https://www.zomato.com"
                value={form.domainName}
                onChange={(e) => update("domainName", e.target.value)}
                aria-invalid={domainInvalid}
                aria-describedby={domainInvalid ? "domain-error" : undefined}
              />
              {domainInvalid && form.domainName.trim() !== "" && !isValidDomainOrUrl(form.domainName) && (
                <p id="domain-error" className="mt-1.5 text-xs text-red-500 dark:text-red-400">
                  Enter a valid URL or domain (e.g. https://example.com or example.com)
                </p>
              )}
            </div>
          </div>

          <div>
            <label className={labelClass}>Project description</label>
            <textarea
              rows={2}
              className={inputClass + " min-h-16 resize-y py-2"}
              placeholder="e.g. Food delivery and restaurant discovery platform"
              value={form.projectDesc}
              onChange={(e) => update("projectDesc", e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Page type</label>
            <PageTypeCards
              options={PAGE_TYPE_OPTIONS}
              value={form.pageType}
              onChange={(v) => update("pageType", v)}
            />
          </div>

          <div>
            <label className={labelClass}>Tech stack</label>
            <select
              className={selectClass}
              value={form.techStack}
              onChange={(e) => update("techStack", e.target.value)}
            >
              {TECH_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o === "custom" ? "Custom" : o}
                </option>
              ))}
            </select>
          </div>

          {form.techStack === "custom" && (
            <div>
              <label className={labelClass}>Custom stack</label>
              <input
                type="text"
                className={inputClass}
                placeholder="e.g. React Native, Node.js"
                value={form.customStack}
                onChange={(e) => update("customStack", e.target.value)}
              />
            </div>
          )}
        </div>
      </StepPanel>

      {/* Step 2: SEO Keywords */}
      <StepPanel
        id="wizard-step-2"
        step={2}
        currentStep={currentStep}
        isOpen={isStepOpen(2)}
        onToggle={() => toggleStep(2)}
        title="SEO Keywords"
        subtitle="Define your keyword strategy"
        validationMessage={currentStep === 2 ? validationMessage : null}
      >
        <div className="space-y-5">
          <div className="flex justify-end">
            <Link
              href="/help#step-2"
              className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              Need help?
            </Link>
          </div>
          <div>
            <label className={`${labelClass} ${primaryKwInvalid ? requiredLabelClass : ""}`}>
              Primary keyword <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <KeywordSuggestions
              value={form.primaryKw}
              onChange={(v) => update("primaryKw", v)}
              placeholder="e.g. order food online, restaurant near me"
              invalid={primaryKwInvalid}
            />
          </div>

          <div>
            <label className={labelClass}>Secondary keywords</label>
            <TagInput
              value={form.secondaryKw}
              onChange={(v) => update("secondaryKw", v)}
              placeholder="e.g. food delivery, best restaurants"
            />
          </div>

          <div>
            <label className={labelClass}>Search intent</label>
            <SegmentControl
              options={SEARCH_INTENT_OPTIONS}
              value={form.searchIntent}
              onChange={(v) => update("searchIntent", v)}
            />
          </div>

          <div>
            <label className={labelClass}>Target audience</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. foodies, restaurant owners, delivery partners"
              value={form.audience}
              onChange={(e) => update("audience", e.target.value)}
            />
          </div>
        </div>
      </StepPanel>

      {/* Step 3: Content Strategy */}
      <StepPanel
        id="wizard-step-3"
        step={3}
        currentStep={currentStep}
        isOpen={isStepOpen(3)}
        onToggle={() => toggleStep(3)}
        title="Content Strategy"
        subtitle="Plan your content approach"
      >
        <div className="space-y-5">
          <div className="flex justify-end">
            <Link
              href="/help#step-3"
              className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              Need help?
            </Link>
          </div>
          <div>
            <label className={labelClass}>Competitor domains</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. swiggy.com, ubereats.com"
              value={form.competitors}
              onChange={(e) => update("competitors", e.target.value)}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Content style</label>
              <select
                className={selectClass}
                value={form.contentStyle}
                onChange={(e) => update("contentStyle", e.target.value)}
              >
                {CONTENT_STYLE_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Tone of writing</label>
              <select
                className={selectClass}
                value={form.contentTone}
                onChange={(e) => update("contentTone", e.target.value)}
              >
                {CONTENT_TONE_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Content length</label>
            <select
              className={selectClass}
              value={form.contentLength}
              onChange={(e) => update("contentLength", e.target.value)}
            >
              {CONTENT_LENGTH_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Extra notes</label>
            <textarea
              rows={2}
              className={inputClass + " min-h-16 resize-y py-2"}
              placeholder="e.g. Focus on local SEO, restaurant listing pages"
              value={form.extraNotes}
              onChange={(e) => update("extraNotes", e.target.value)}
            />
          </div>
        </div>
      </StepPanel>

      {/* Step 4: Output Options */}
      <StepPanel
        id="wizard-step-4"
        step={4}
        currentStep={currentStep}
        isOpen={isStepOpen(4)}
        onToggle={() => toggleStep(4)}
        title="Output Options"
        subtitle="Configure technical SEO settings"
      >
        <div className="space-y-5">
          <div className="flex justify-end">
            <Link
              href="/help#step-4"
              className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              Need help?
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Title format</label>
              <select
                className={selectClass}
                value={form.titleFormat}
                onChange={(e) => update("titleFormat", e.target.value)}
              >
                {TITLE_FORMAT_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Rendering strategy</label>
              <select
                className={selectClass}
                value={form.rendering}
                onChange={(e) => update("rendering", e.target.value)}
              >
                {RENDERING_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o.split("(")[0].trim()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Structured data</label>
              <select
                className={selectClass}
                value={form.structuredData}
                onChange={(e) => update("structuredData", e.target.value)}
              >
                {STRUCTURED_DATA_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o === "none" ? "None" : o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Sitemap</label>
              <select
                className={selectClass}
                value={form.sitemap}
                onChange={(e) => update("sitemap", e.target.value)}
              >
                {SITEMAP_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o.includes("dynamic")
                      ? "Dynamic XML"
                      : o.includes("static")
                        ? "Static"
                        : "next-sitemap"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Image format</label>
              <select
                className={selectClass}
                value={form.imageFormat}
                onChange={(e) => update("imageFormat", e.target.value)}
              >
                {IMAGE_FORMAT_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Load target</label>
              <select
                className={selectClass}
                value={form.loadTarget}
                onChange={(e) => update("loadTarget", e.target.value)}
              >
                {LOAD_TARGET_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>CDN</label>
              <select
                className={selectClass}
                value={form.cdn}
                onChange={(e) => update("cdn", e.target.value)}
              >
                {CDN_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Analytics</label>
              <select
                className={selectClass}
                value={form.analytics}
                onChange={(e) => update("analytics", e.target.value)}
              >
                {ANALYTICS_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o === "none" ? "None" : o}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Robots.txt rules</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. block /api/ and /admin/"
              value={form.robotsRules}
              onChange={(e) => update("robotsRules", e.target.value)}
            />
          </div>
        </div>
      </StepPanel>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => goTo(currentStep - 1)}
          disabled={currentStep <= 1}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex items-center gap-2">
          {currentStep < 4 && (
            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-transparent px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-foreground px-5 text-sm font-medium text-background shadow-lg shadow-foreground/10 transition-all hover:opacity-90 hover:shadow-xl"
          >
            <Sparkles className="h-4 w-4" />
            Generate SEO Prompt
          </button>
        </div>
      </div>
    </div>
  );
}

function StepPanel({
  id,
  step,
  currentStep,
  isOpen,
  onToggle,
  title,
  subtitle,
  validationMessage,
  children,
}: {
  id?: string;
  step: number;
  currentStep: number;
  isOpen: boolean;
  onToggle: () => void;
  title: string;
  subtitle: string;
  validationMessage?: string | null;
  children: React.ReactNode;
}) {
  const isCompleted = step < currentStep;

  return (
    <div
      id={id}
      className={`overflow-hidden rounded-xl border transition-all ${
        isOpen
          ? "border-foreground/15 bg-card shadow-sm"
          : "border-border/60 bg-card/50"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
              isCompleted
                ? "bg-foreground text-background"
                : isOpen
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {step}
          </div>
          <div className="text-left">
            <span className="text-sm font-semibold">{title}</span>
            <span className="ml-2 text-xs text-muted-foreground">
              {subtitle}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isCompleted && (
            <span className="rounded-full bg-foreground/10 px-2.5 py-0.5 text-[10px] font-medium text-foreground/70">
              Done
            </span>
          )}
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>
      {isOpen && (
        <div className="border-t border-border/40 px-5 pb-5 pt-4">
          {validationMessage && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:border-red-400/50 dark:bg-red-400/10 dark:text-red-400"
            >
              {validationMessage}
            </div>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
