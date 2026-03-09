import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generate SEO Prompt",
  description:
    "Fill in your project details, keywords, and content strategy to generate a complete, ready-to-use SEO prompt. AI-powered and instant.",
  alternates: { canonical: "/generate" },
  openGraph: {
    title: "Generate SEO Prompt | SEO Prompt Generator",
    description:
      "Fill in your project details and get a complete SEO plan including keywords, content structure, and optimization instructions.",
    url: "/generate",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SEO Prompt Generator — One prompt, full SEO plan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
};

export default function GenerateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
