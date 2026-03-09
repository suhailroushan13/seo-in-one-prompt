import { Hero } from "@/components/Hero";
import { FeatureRow } from "@/components/FeatureRow";
import { JsonLd } from "@/components/JsonLd";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://seoprompt.ai";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SEO Prompt Generator",
  url: SITE_URL,
  description:
    "Describe your project and get a complete SEO plan including keywords, content structure, metadata, and optimization instructions.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/generate`,
    "query-input": "required name=search_term_string",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SEO Prompt Generator",
  url: SITE_URL,
  logo: `${SITE_URL}/android-chrome-192x192.png`,
  founder: {
    "@type": "Person",
    name: "Suhail Roushan",
    url: "https://suhailroushan.com",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
  ],
};

export default function Home() {
  return (
    <div className="min-h-full overflow-x-hidden">
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <Hero />
      <FeatureRow />
    </div>
  );
}
