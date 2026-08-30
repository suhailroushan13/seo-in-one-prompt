"use client";

import { Check } from "lucide-react";

interface StepProgressProps {
  currentStep: number;
  stepLabels: string[];
  /** Highest step the user has reached — anything up to it is navigable. */
  furthestStep: number;
  onStepClick: (step: number) => void;
}

export function StepProgress({
  currentStep,
  stepLabels,
  furthestStep,
  onStepClick,
}: StepProgressProps) {
  const total = stepLabels.length;

  return (
    <nav aria-label="Progress">
      <ol className="flex items-center">
        {stepLabels.map((label, index) => {
          const step = index + 1;
          const isActive = step === currentStep;
          const isDone = step < currentStep;
          const reachable = step <= furthestStep;

          return (
            <li key={label} className="flex flex-1 items-center last:flex-none">
              <button
                type="button"
                onClick={() => reachable && onStepClick(step)}
                disabled={!reachable}
                aria-current={isActive ? "step" : undefined}
                className="group flex items-center gap-2 rounded-lg disabled:cursor-not-allowed"
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    isDone
                      ? "bg-brand text-brand-foreground"
                      : isActive
                        ? "bg-brand text-brand-foreground ring-4 ring-brand-ring"
                        : "border border-border bg-surface-muted text-muted-foreground"
                  }`}
                >
                  {isDone ? <Check className="h-4 w-4" aria-hidden /> : step}
                </span>
                <span
                  className={`hidden text-xs font-medium sm:block ${
                    isActive
                      ? "text-foreground"
                      : isDone
                        ? "text-muted-foreground"
                        : "text-muted-foreground/70"
                  }`}
                >
                  {label}
                </span>
              </button>
              {step < total && (
                <span
                  aria-hidden
                  className={`mx-2 h-px flex-1 transition-colors sm:mx-3 ${
                    isDone ? "bg-brand/50" : "bg-border"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
