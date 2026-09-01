import type { FormState } from "./types";
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
} from "./types";

/**
 * One coherent worked example. It powers three things at once: the placeholder
 * text on every control, the summary card at the top of the generator, and the
 * "Fill the example" button. Keeping them on one object stops them drifting.
 */
export const EXAMPLE_FORM: FormState = {
  brandName: "DevHire",
  domainName: "https://devhire.io",
  projectDesc: "Hire vetted developers straight from their GitHub history",
  techStack: TECH_OPTIONS[0],
  customStack: "",
  pageType: PAGE_TYPE_OPTIONS[0].label,
  primaryKw: "hire developers from github",
  secondaryKw:
    "github developer hiring, technical hiring platform, vetted remote developers",
  searchIntent: SEARCH_INTENT_OPTIONS[0].value,
  audience: "CTOs, engineering managers, technical founders",
  competitors: "hired.com, toptal.com, wellfound.com",
  contentStyle: CONTENT_STYLE_OPTIONS[0],
  contentTone: CONTENT_TONE_OPTIONS[0],
  contentLength: CONTENT_LENGTH_OPTIONS[1],
  pageTitle: "",
  metaDesc: "",
  ogImage: "",
  titleFormat: TITLE_FORMAT_OPTIONS[1],
  rendering: RENDERING_OPTIONS[0],
  structuredData: STRUCTURED_DATA_OPTIONS[0],
  sitemap: SITEMAP_OPTIONS[0],
  imageFormat: IMAGE_FORMAT_OPTIONS[0],
  robotsRules: "block /api/ and /admin/",
  loadTarget: LOAD_TARGET_OPTIONS[1],
  cdn: CDN_OPTIONS[0],
  analytics: ANALYTICS_OPTIONS[0],
  extraNotes:
    "Push the comparison table above the fold and mirror the FAQ block in FAQPage schema.",
};

/** Placeholder text for a control, always the example value for that field. */
export function example<K extends keyof FormState>(key: K): string {
  return EXAMPLE_FORM[key];
}

/** The example rendered as label/value rows for the summary card. */
export const EXAMPLE_ROWS: Array<{ label: string; value: string }> = [
  { label: "Brand name", value: EXAMPLE_FORM.brandName },
  { label: "Domain", value: EXAMPLE_FORM.domainName.replace(/^https?:\/\//i, "") },
  { label: "Page type", value: EXAMPLE_FORM.pageType },
  { label: "Description", value: EXAMPLE_FORM.projectDesc },
  { label: "Primary keyword", value: EXAMPLE_FORM.primaryKw },
  { label: "Secondary keywords", value: EXAMPLE_FORM.secondaryKw },
  { label: "Search intent", value: "Commercial" },
  { label: "Audience", value: EXAMPLE_FORM.audience },
  { label: "Competitors", value: EXAMPLE_FORM.competitors },
  { label: "Tone & length", value: `${EXAMPLE_FORM.contentTone} · ${EXAMPLE_FORM.contentLength}` },
  { label: "Rendering", value: EXAMPLE_FORM.rendering.split("(")[0].trim() },
  { label: "Structured data", value: EXAMPLE_FORM.structuredData },
];

/** True when nothing has been changed away from the example values. */
export function isExampleForm(form: FormState): boolean {
  return (Object.keys(EXAMPLE_FORM) as Array<keyof FormState>).every(
    (key) => form[key] === EXAMPLE_FORM[key]
  );
}
