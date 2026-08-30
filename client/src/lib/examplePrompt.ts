/** Sample output shown on the landing page and /examples. Kept in one place so both stay in sync. */
export const EXAMPLE_PROMPT = `You are a world-class full-stack SEO engineer and Next.js expert. Implement a COMPLETE, production-ready SEO setup for the project below. Do not summarise — write the actual files, tags, and configuration.

==========================================
PROJECT OVERVIEW
==========================================
Brand Name      : DevHire
Domain          : https://devhire.io
Page Type       : SaaS landing page
Tech Stack      : Next.js (App Router) + TypeScript + Tailwind
Description     : Hire vetted developers straight from their GitHub history
Target Audience : CTOs, engineering managers, technical founders

==========================================
1. KEYWORD STRATEGY & MAPPING
==========================================
Primary Keyword    : hire developers from github
Secondary Keywords : github developer hiring, technical hiring platform, vetted remote developers
Search Intent      : Commercial investigation
Competitors        : hired.com, toptal.com, wellfound.com

Rules:
- Exactly one primary keyword per page; never cannibalise across URLs.
- Use secondary keywords as supporting/LSI terms in H2s and body copy.
- Cluster plan: 1 pillar page + child pages under /blog/.
- URL structure: /hire-developers-from-github, /blog/[slug].

==========================================
2. METADATA & SOCIAL TAGS
==========================================
Write the exact Next.js \`metadata\` export:
- title (50-60 chars, primary keyword front-loaded)
- description (140-160 chars, one benefit + one differentiator + CTA)
- canonical URL, robots directives
- openGraph: type, title, description, url, siteName, 1200x630 image
- twitter: summary_large_image card

==========================================
3. STRUCTURED DATA (JSON-LD)
==========================================
Emit valid schema.org JSON-LD for: Organization, WebSite (with SearchAction),
SoftwareApplication, BreadcrumbList, and FAQPage. Validate against Rich Results.

==========================================
4. CONTENT ARCHITECTURE
==========================================
Exactly one H1. H2/H3 outline covering the primary keyword and each secondary
keyword. 1,400-1,800 words. Include a comparison table, a FAQ block that mirrors
the FAQPage schema, and internal links to the three highest-value cluster pages.

==========================================
5. TECHNICAL SEO
==========================================
- app/sitemap.ts and app/robots.ts with correct priorities and change frequency
- Rendering strategy per route (static, ISR interval, or dynamic) with reasoning
- Image strategy: next/image, AVIF/WebP, explicit width/height, descriptive alt
- hreflang and i18n plan (or an explicit statement that it is out of scope)

==========================================
6. CORE WEB VITALS TARGETS
==========================================
LCP < 2.5s · INP < 200ms · CLS < 0.1
Ship: font preloading with display:swap, a critical-CSS strategy, code splitting
for below-the-fold sections, and a preconnect list.

==========================================
7. DELIVERABLES
==========================================
Output every file in full, ready to paste: layout metadata, JSON-LD components,
sitemap, robots, and the page copy. No placeholders, no TODOs.`;
