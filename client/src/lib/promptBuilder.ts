import type { FormState } from "./types";

function v(value: string | undefined, fallback: string): string {
  return (value ?? "").trim() || fallback;
}


export function buildPrompt(s: FormState): string {
  const brand = v(s.brandName, "MyProject");
  const domain = v(s.domainName, "https://domain.com");
  const desc = v(s.projectDesc, "[describe your project]");
  const stack = s.techStack === "custom" ? v(s.customStack, "") : s.techStack;
  const primaryKwVal = v(s.primaryKw, "[primary keyword]");
  const secondaryKwVal = v(s.secondaryKw, "[secondary keywords]");
  const audienceVal = v(s.audience, "[target users]");
  const competitorsVal = v(s.competitors, "[competitor domains]");
  const pageTitleVal =
    v(s.pageTitle, "") || `${brand} | ${primaryKwVal}`;
  const metaDescVal =
    v(s.metaDesc, "") || `[Describe ${brand} in 1 sentence with a CTA]`;
  const ogImageVal = v(s.ogImage, "") || `${domain}/og-image.png`;
  const robotsVal =
    v(s.robotsRules, "") || "block /api/ and /admin/, allow all public pages";
  const slug = primaryKwVal.toLowerCase().replace(/\s+/g, "-");

  return `You are a world-class full-stack SEO engineer and Next.js expert. Implement a COMPLETE, production-ready SEO setup for the following project. Follow every instruction precisely.

══════════════════════════════════════════
PROJECT OVERVIEW
══════════════════════════════════════════
Brand Name     : ${brand}
Domain         : ${domain}
Project Type   : ${s.pageType}
Tech Stack     : ${stack}
Description    : ${desc}
Target Audience: ${audienceVal}
Content Style  : ${v(s.contentStyle, "Professional")}
Content Tone   : ${v(s.contentTone, "Authoritative")}
Content Length  : ${v(s.contentLength, "Medium")}

══════════════════════════════════════════
1. SEO STRATEGY & KEYWORD MAPPING
══════════════════════════════════════════
Primary Keyword  : ${primaryKwVal}
Secondary Keywords: ${secondaryKwVal}
Search Intent    : ${s.searchIntent}
Competitors      : ${competitorsVal}

Rules:
- Map exactly 1 primary keyword per page (zero keyword cannibalization).
- Use secondary keywords as LSI/supporting terms throughout the content and headings.
- Analyze what competitors (${competitorsVal}) are doing right and outperform them.
- Plan content clusters: 1 pillar page + child pages under /blog/ or /guides/.
- Identify 2–3 pages that can win featured snippets (answer boxes). Use structured Q&A format there.
- Design a clean URL structure: /${slug}, /blog/[slug], /about, /contact.
- Use canonical URL: ${domain}/ (HTTPS only, no trailing slash variants).
- No duplicate content. Every page must have a unique angle.

══════════════════════════════════════════
2. DOMAIN & BRANDING
══════════════════════════════════════════
- Brand name "${brand}" used consistently across all pages, meta tags, OG tags, and JSON-LD.
- Preferred domain: ${domain} (HTTPS, canonical, no www unless chosen).
- Title format: ${s.titleFormat} — apply this format across ALL pages.
- Meta description tone: CTA-based, action-oriented, under 160 characters.
- No brand name casing variations — always "${brand}" exactly.

══════════════════════════════════════════
3. TECHNICAL SEO SETUP
══════════════════════════════════════════
Rendering       : ${s.rendering}
Sitemap         : ${s.sitemap}
Robots.txt      : ${robotsVal}
Structured Data : ${s.structuredData}
Image Format    : ${s.imageFormat}

Implement:
a) robots.txt — ${robotsVal}
b) sitemap.xml — ${s.sitemap}
c) Structured Data — add JSON-LD for ${s.structuredData}
d) Canonical tag on EVERY page
e) HTTPS enforced.

══════════════════════════════════════════
4. HTML & META TAGS
══════════════════════════════════════════
<title>${pageTitleVal}</title>
<meta name="description" content="${metaDescVal}" />
<meta name="author" content="${brand}" />
<link rel="author" href="${domain}" />
OG/Twitter: title, description, image (${ogImageVal}), url ${domain}
Favicon and manifest. JSON-LD WebSite schema.

══════════════════════════════════════════
5. FAVICON & ASSETS
══════════════════════════════════════════
Include standard favicon and PWA assets. Set cache headers for icons.

══════════════════════════════════════════
6. PERFORMANCE & CORE WEB VITALS
══════════════════════════════════════════
Target: ${s.loadTarget}. CDN: ${s.cdn}. Image format: ${s.imageFormat}.
LCP < 2.5s, INP < 200ms, CLS < 0.1.

══════════════════════════════════════════
7. NEXT.JS / FRAMEWORK-SPECIFIC SEO
══════════════════════════════════════════
Use Metadata API. ${s.rendering}. Dynamic sitemap. next/image. BreadcrumbList on interior pages.

══════════════════════════════════════════
8. UX & NAVIGATION
══════════════════════════════════════════
Mobile-first. Navigation depth ≤ 3. Internal linking. Breadcrumbs. WCAG AA. Set up ${s.analytics}.

══════════════════════════════════════════
9. ANALYTICS & TRACKING
══════════════════════════════════════════
Set up ${s.analytics}. Submit sitemap to Search Console. Verify domain.

══════════════════════════════════════════
10. CONTENT CLUSTER PLAN
══════════════════════════════════════════
Pillar: "${primaryKwVal}" at ${domain}/
Child pages under /blog/ linking back to pillar.

══════════════════════════════════════════
FINAL DELIVERABLES
══════════════════════════════════════════
**The above was the pre-code spec and requirements for SEO. Implement everything and deliver the post-code so the project has a complete, production-ready SEO setup.**

1. Complete <head> (meta, OG, Twitter, favicons, JSON-LD)
2. robots.txt
3. sitemap.xml
4. site.webmanifest
5. next.config.js (redirects, headers, image)
6. Reusable SEO component
7. JSON-LD components
8. Performance checklist
9. Analytics integration

Do NOT skip any step. Real code only — no placeholders.

**Contact:** suhailroushan13@gmail.com
${s.extraNotes ? `\n\nSPECIAL REQUIREMENTS:\n${s.extraNotes}` : ""}`;
}
