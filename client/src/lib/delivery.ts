import { SITE_NAME, SITE_URL } from "./product";

/** Slugifies a brand name for use in a download filename. */
export function slugifyBrand(brandName: string | undefined | null): string {
  return (brandName ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

export function promptFilename(
  brandName: string | undefined | null,
  extension: "pdf" | "md" | "txt"
): string {
  const slug = slugifyBrand(brandName);
  return slug ? `${slug}-seo-prompt.${extension}` : `seo-prompt.${extension}`;
}

export interface DeliveryMeta {
  brandName?: string;
  fullName?: string;
  email?: string;
  orderId?: string;
  generatedAt?: string;
}

/** Markdown copy of the prompt, with a short provenance header. */
export function buildMarkdown(prompt: string, meta: DeliveryMeta = {}): string {
  const brand = (meta.brandName ?? "").trim() || "Your project";
  const generatedAt = meta.generatedAt ?? new Date().toISOString();
  const rows = [
    `- **Project:** ${brand}`,
    meta.fullName?.trim() ? `- **Prepared for:** ${meta.fullName.trim()}` : null,
    meta.email?.trim() ? `- **Email:** ${meta.email.trim()}` : null,
    meta.orderId ? `- **Order:** \`${meta.orderId}\`` : null,
    `- **Generated:** ${generatedAt}`,
  ].filter(Boolean);

  return [
    `# SEO implementation prompt — ${brand}`,
    "",
    ...rows,
    "",
    "> Paste the block below into Cursor, Claude, or any AI editor.",
    "",
    "```text",
    prompt.trim(),
    "```",
    "",
    "---",
    `Generated with [${SITE_NAME}](${SITE_URL}).`,
    "",
  ].join("\n");
}

/** Plain-text copy — the raw prompt with a minimal header. */
export function buildPlainText(prompt: string, meta: DeliveryMeta = {}): string {
  const brand = (meta.brandName ?? "").trim() || "Your project";
  const generatedAt = meta.generatedAt ?? new Date().toISOString();
  const header = [
    `SEO implementation prompt — ${brand}`,
    meta.orderId ? `Order: ${meta.orderId}` : null,
    `Generated: ${generatedAt}`,
    `Source: ${SITE_URL}`,
  ]
    .filter(Boolean)
    .join("\n");

  return `${header}\n${"=".repeat(60)}\n\n${prompt.trim()}\n`;
}
