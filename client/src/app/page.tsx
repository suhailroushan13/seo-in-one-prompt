import { JsonLd } from "@/components/JsonLd";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Deliverables } from "@/components/home/Deliverables";
import { SamplePrompt } from "@/components/home/SamplePrompt";
import { PricingCard } from "@/components/home/PricingCard";
import { Faq, FAQ_ITEMS } from "@/components/home/Faq";
import { FinalCta } from "@/components/home/FinalCta";
import { PRICE, SITE_NAME, SITE_URL } from "@/lib/product";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description:
    "Describe your page and get a complete SEO implementation prompt — keywords, metadata, schema, technical SEO, and Core Web Vitals targets.",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/android-chrome-192x192.png`,
  founder: {
    "@type": "Person",
    name: "Suhail Roushan",
    url: "https://suhailroushan.com",
  },
};

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "SEO implementation prompt",
  description:
    "A complete, structured SEO implementation prompt for one page: keyword strategy, metadata, structured data, content architecture, technical SEO, and Core Web Vitals targets.",
  brand: { "@type": "Brand", name: SITE_NAME },
  offers: {
    "@type": "Offer",
    price: PRICE.amount,
    priceCurrency: PRICE.currency,
    availability: "https://schema.org/InStock",
    url: `${SITE_URL}/generate`,
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function Home() {
  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={productJsonLd} />
      <JsonLd data={faqJsonLd} />
      <Hero />
      <HowItWorks />
      <Deliverables />
      <SamplePrompt />
      <PricingCard />
      <Faq />
      <FinalCta />
    </>
  );
}
