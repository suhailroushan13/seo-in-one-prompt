"use client";

import { useMemo } from "react";
import { buildPrompt } from "@/lib/promptBuilder";
import type { FormState } from "@/lib/types";

interface PromptPreviewProps {
  form: FormState;
}

export function PromptPreview({ form }: PromptPreviewProps) {
  const preview = useMemo(() => buildPrompt(form), [form]);

  const hasContent = form.brandName || form.primaryKw || form.projectDesc;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              hasContent ? "bg-green-500" : "bg-muted-foreground/30"
            }`}
          />
          <span className="text-xs font-medium text-muted-foreground">
            SEO Prompt Preview
          </span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground/50">
          live
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {hasContent ? (
          <pre className="whitespace-pre-wrap p-4 font-mono text-xs leading-relaxed text-foreground/80">
            {preview}
          </pre>
        ) : (
          <div className="flex h-full min-h-[200px] items-center justify-center p-8 text-center">
            <div>
              <p className="text-sm text-muted-foreground/60">
                Start filling the form to see your prompt preview here
              </p>
              <p className="mt-1 text-xs text-muted-foreground/40">
                Updates live as you type
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
