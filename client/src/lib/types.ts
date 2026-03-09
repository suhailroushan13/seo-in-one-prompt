/** Payment plan tiers – keep in sync with backend User model */
export type PaymentPlan = "free" | "pro" | "enterprise";

export interface UserPayment {
  plan: PaymentPlan;
  paymentDate: string | null;
  isPaid: boolean;
  nextBillingDate?: string;
  stripeCustomerId?: string;
  subscriptionId?: string;
}

/** User shape for auth/session and API responses */
export interface User {
  id: string;
  fullName: string;
  email: string;
  payment: UserPayment;
  emailVerified: boolean;
  lastLoginAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FormState {
  brandName: string;
  domainName: string;
  projectDesc: string;
  techStack: string;
  customStack: string;
  pageType: string;
  primaryKw: string;
  secondaryKw: string;
  searchIntent: string;
  audience: string;
  competitors: string;
  contentStyle: string;
  contentTone: string;
  contentLength: string;
  pageTitle: string;
  metaDesc: string;
  ogImage: string;
  titleFormat: string;
  rendering: string;
  structuredData: string;
  sitemap: string;
  imageFormat: string;
  robotsRules: string;
  loadTarget: string;
  cdn: string;
  analytics: string;
  extraNotes: string;
}

export interface HistoryEntry {
  id: string;
  title: string;
  prompt: string;
  createdAt: string;
}

export const TECH_OPTIONS = [
  "Next.js (App Router) + TypeScript + Tailwind + MongoDB",
  "Next.js (Pages Router) + TypeScript",
  "React + Vite + TypeScript",
  "Remix + TypeScript",
  "SvelteKit",
  "plain HTML / CSS / JS",
  "custom",
] as const;

export const PAGE_TYPE_OPTIONS = [
  { label: "SaaS Landing Page", icon: "Rocket" },
  { label: "Blog / Content Site", icon: "FileText" },
  { label: "Portfolio / Personal Brand", icon: "User" },
  { label: "E-commerce", icon: "ShoppingCart" },
  { label: "Full Web App", icon: "LayoutDashboard" },
  { label: "Documentation Site", icon: "BookOpen" },
] as const;

export const SEARCH_INTENT_OPTIONS = [
  { value: "Commercial (user wants to evaluate / buy)", label: "Commercial" },
  { value: "Informational (user wants to learn)", label: "Informational" },
  { value: "Transactional (user ready to act)", label: "Transactional" },
  { value: "Navigational (user knows the brand)", label: "Navigational" },
] as const;

export const TITLE_FORMAT_OPTIONS = [
  "Brand | Keyword",
  "Keyword — Brand",
  "Keyword | Brand",
  "Brand: Keyword",
] as const;

export const RENDERING_OPTIONS = [
  "SSG (Static Site Generation) for max performance",
  "SSR (Server-Side Rendering) for dynamic pages",
  "ISR (Incremental Static Regeneration)",
  "CSR (Client-Side Rendering) — SEO limited",
] as const;

export const STRUCTURED_DATA_OPTIONS = [
  "WebSite + SoftwareApplication schema",
  "WebSite + Organization schema",
  "Article + BreadcrumbList schema",
  "Product + Review schema",
  "FAQPage schema",
  "none",
] as const;

export const SITEMAP_OPTIONS = [
  "dynamic XML sitemap via /sitemap.xml route",
  "static sitemap.xml in /public",
  "next-sitemap package",
] as const;

export const IMAGE_FORMAT_OPTIONS = [
  "WebP with AVIF fallback",
  "AVIF primary",
  "next/image with automatic optimization",
] as const;

export const LOAD_TARGET_OPTIONS = [
  "under 1.5s (excellent)",
  "under 2s (good)",
  "under 3s (acceptable)",
] as const;

export const CDN_OPTIONS = [
  "Vercel Edge Network",
  "Cloudflare",
  "AWS CloudFront",
  "none / not decided",
] as const;

export const ANALYTICS_OPTIONS = [
  "Google Analytics 4 + Google Search Console",
  "Plausible Analytics (privacy-first)",
  "Vercel Analytics",
  "PostHog",
  "none",
] as const;

export const CONTENT_STYLE_OPTIONS = [
  "Professional / Enterprise",
  "Casual / Conversational",
  "Technical / Developer-focused",
  "Marketing / Sales-driven",
] as const;

export const CONTENT_TONE_OPTIONS = [
  "Authoritative",
  "Friendly",
  "Persuasive",
  "Educational",
  "Minimalist",
] as const;

export const CONTENT_LENGTH_OPTIONS = [
  "Short (500–800 words)",
  "Medium (1000–1500 words)",
  "Long-form (2000–3000 words)",
  "Comprehensive (3000+ words)",
] as const;

export function getDefaultFormState(): FormState {
  return {
    brandName: "",
    domainName: "",
    projectDesc: "",
    techStack: TECH_OPTIONS[0],
    customStack: "",
    pageType: PAGE_TYPE_OPTIONS[0].label,
    primaryKw: "",
    secondaryKw: "",
    searchIntent: SEARCH_INTENT_OPTIONS[0].value,
    audience: "",
    competitors: "",
    contentStyle: CONTENT_STYLE_OPTIONS[0],
    contentTone: CONTENT_TONE_OPTIONS[0],
    contentLength: CONTENT_LENGTH_OPTIONS[1],
    pageTitle: "",
    metaDesc: "",
    ogImage: "",
    titleFormat: TITLE_FORMAT_OPTIONS[0],
    rendering: RENDERING_OPTIONS[0],
    structuredData: STRUCTURED_DATA_OPTIONS[0],
    sitemap: SITEMAP_OPTIONS[0],
    imageFormat: IMAGE_FORMAT_OPTIONS[0],
    robotsRules: "",
    loadTarget: LOAD_TARGET_OPTIONS[1],
    cdn: CDN_OPTIONS[0],
    analytics: ANALYTICS_OPTIONS[0],
    extraNotes: "",
  };
}
