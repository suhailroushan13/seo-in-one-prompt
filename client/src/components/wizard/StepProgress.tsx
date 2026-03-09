"use client";

import { Check } from "lucide-react";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  onStepClick: (step: number) => void;
}

export function StepProgress({
  currentStep,
  totalSteps,
  stepLabels,
  onStepClick,
}: StepProgressProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <div key={step} className="flex flex-1 items-center">
            <button
              type="button"
              onClick={() => onStepClick(step)}
              className="group flex flex-1 items-center gap-2"
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                  isCompleted
                    ? "bg-foreground text-background"
                    : isActive
                      ? "bg-foreground text-background ring-4 ring-foreground/10"
                      : "border border-border bg-muted text-muted-foreground group-hover:border-foreground/30"
                }`}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5" /> : step}
              </div>
              <span
                className={`hidden text-xs font-medium sm:block ${
                  isActive
                    ? "text-foreground"
                    : isCompleted
                      ? "text-foreground/70"
                      : "text-muted-foreground"
                }`}
              >
                {stepLabels[i]}
              </span>
            </button>
            {i < totalSteps - 1 && (
              <div
                className={`mx-2 h-px flex-1 transition-colors ${
                  isCompleted ? "bg-foreground/30" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
