import {
  loadUserFromStorage,
  loadFormFromStorage,
  loadPendingPrompt,
  loadGeneratedPrompt,
  loadViewPrompt,
} from "@/lib/formStorage";
import { getHistory } from "@/components/HistorySidebar";

/** Builds a single text file with all app localStorage/sessionStorage data. */
export function buildStorageExportText(): string {
  if (typeof window === "undefined") return "";

  const lines: string[] = [];
  const sep = (title: string) => {
    lines.push("");
    lines.push("=".repeat(60));
    lines.push(title);
    lines.push("=".repeat(60));
  };

  lines.push("SEO Prompt – Stored Data Export");
  lines.push(`Exported at: ${new Date().toISOString()}`);

  const user = loadUserFromStorage();
  if (user.fullName || user.email) {
    sep("User (localStorage)");
    lines.push(`Full name: ${user.fullName || "(empty)"}`);
    lines.push(`Email: ${user.email || "(empty)"}`);
  }

  const form = loadFormFromStorage();
  sep("Form draft (localStorage)");
  lines.push(JSON.stringify(form, null, 2));

  const pending = loadPendingPrompt();
  if (pending) {
    sep("Pending prompt (localStorage)");
    lines.push(`Full name: ${pending.fullName}`);
    lines.push(`Email: ${pending.email}`);
    lines.push(`Brand: ${pending.brandName || "(empty)"}`);
    lines.push("");
    lines.push("--- Prompt ---");
    lines.push(pending.prompt);
  }

  const generated = loadGeneratedPrompt();
  if (generated?.trim()) {
    sep("Generated prompt (localStorage)");
    lines.push(generated);
  }

  const viewPrompt = loadViewPrompt();
  if (viewPrompt?.trim()) {
    sep("View / current prompt (sessionStorage)");
    lines.push(viewPrompt);
  }

  const history = getHistory();
  if (history.length > 0) {
    sep("History (localStorage)");
    lines.push(JSON.stringify(history, null, 2));
  }

  return lines.join("\n").trim() || "No stored data.";
}

/** Triggers download of a .txt file containing all storage data. Returns filename used. */
export function downloadStorageAsTxt(): string {
  const text = buildStorageExportText();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const filename = `seo-prompt-export-${timestamp}.txt`;
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  return filename;
}
