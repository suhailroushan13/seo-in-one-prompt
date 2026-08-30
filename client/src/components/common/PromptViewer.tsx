"use client";

import { useMemo, useState } from "react";
import { Download, FileDown, FileText, Loader2 } from "lucide-react";
import { CopyButton } from "@/components/common/CopyButton";
import { buildMarkdown, buildPlainText, promptFilename } from "@/lib/delivery";
import { parsePromptSections, shortSectionLabel } from "@/lib/promptSections";

export interface PromptViewerProps {
  prompt: string;
  brandName?: string;
  fullName?: string;
  email?: string;
  orderId?: string;
  generatedAt?: string;
  /** Server-provided filenames; falls back to deriving them from the brand name. */
  filenames?: { pdf: string; md: string; txt: string };
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function PromptViewer({
  prompt,
  brandName,
  fullName,
  email,
  orderId,
  generatedAt,
  filenames,
}: PromptViewerProps) {
  const [pdfState, setPdfState] = useState<"idle" | "loading" | "error">("idle");

  const sections = useMemo(() => parsePromptSections(prompt), [prompt]);
  const meta = useMemo(
    () => ({ brandName, fullName, email, orderId, generatedAt }),
    [brandName, fullName, email, orderId, generatedAt]
  );

  const names = filenames ?? {
    pdf: promptFilename(brandName, "pdf"),
    md: promptFilename(brandName, "md"),
    txt: promptFilename(brandName, "txt"),
  };

  const wordCount = useMemo(
    () => prompt.trim().split(/\s+/).filter(Boolean).length,
    [prompt]
  );

  const downloadMarkdown = () => {
    saveBlob(
      new Blob([buildMarkdown(prompt, meta)], { type: "text/markdown;charset=utf-8" }),
      names.md
    );
  };

  const downloadText = () => {
    saveBlob(
      new Blob([buildPlainText(prompt, meta)], { type: "text/plain;charset=utf-8" }),
      names.txt
    );
  };

  const downloadPdf = async () => {
    setPdfState("loading");
    try {
      const response = await fetch("/api/report/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          orderId ? { orderId } : { prompt, brandName, fullName, email }
        ),
      });
      if (!response.ok) throw new Error(`PDF request failed (${response.status})`);
      saveBlob(await response.blob(), names.pdf);
      setPdfState("idle");
    } catch {
      setPdfState("error");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="card-surface p-4">
          <h2 className="field-label">Download</h2>
          <div className="mt-3 grid gap-2">
            <button
              type="button"
              onClick={downloadPdf}
              disabled={pdfState === "loading"}
              className="btn btn-brand w-full"
            >
              {pdfState === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <FileDown className="h-4 w-4" aria-hidden />
              )}
              {pdfState === "loading" ? "Preparing…" : "PDF"}
            </button>
            <button type="button" onClick={downloadMarkdown} className="btn btn-outline w-full">
              <FileText className="h-4 w-4" aria-hidden />
              Markdown
            </button>
            <button type="button" onClick={downloadText} className="btn btn-outline w-full">
              <Download className="h-4 w-4" aria-hidden />
              Plain text
            </button>
            <CopyButton
              value={prompt}
              label="Copy prompt"
              copiedLabel="Copied to clipboard"
              className="btn btn-solid w-full"
            />
          </div>
          {pdfState === "error" && (
            <p className="field-error mt-3" role="alert">
              PDF could not be generated. Use Markdown or plain text, or try again.
            </p>
          )}
          <p className="field-hint mt-3">
            {sections.length} sections · {wordCount.toLocaleString()} words
          </p>
        </div>

        {sections.length > 1 && (
          <nav aria-label="Prompt sections" className="card-surface mt-4 hidden p-4 lg:block">
            <h2 className="field-label">Sections</h2>
            <ol className="mt-3 space-y-1">
              {sections.map((section, index) =>
                section.title ? (
                  <li key={`${section.title}-${index}`}>
                    <a
                      href={`#section-${index}`}
                      className="block truncate rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
                    >
                      {shortSectionLabel(section.title)}
                    </a>
                  </li>
                ) : null
              )}
            </ol>
          </nav>
        )}
      </aside>

      <div className="min-w-0 space-y-4">
        {sections.map((section, index) => (
          <section
            key={`${section.title ?? "intro"}-${index}`}
            id={`section-${index}`}
            className="card-surface scroll-mt-24 overflow-hidden"
          >
            <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
              <h3 className="truncate text-sm font-semibold tracking-tight">
                {section.title ? shortSectionLabel(section.title) : "Overview"}
              </h3>
              <CopyButton
                value={section.body}
                label="Copy"
                copiedLabel="Copied"
                className="btn btn-ghost h-8 min-h-8 px-2.5 text-xs"
              />
            </header>
            <pre className="prompt-scroll px-4 py-4 text-[13px] leading-relaxed sm:px-5">
              {section.body}
            </pre>
          </section>
        ))}
      </div>
    </div>
  );
}
