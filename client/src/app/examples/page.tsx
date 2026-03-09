import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Example Prompts",
  description:
    "Curated SEO prompt examples for SaaS landing pages, blogs, e-commerce, and more. See what the generator produces.",
  alternates: { canonical: "/examples" },
  openGraph: {
    title: "Example Prompts | SEO Prompt Generator",
    description:
      "Curated SEO prompt examples for different project types.",
    url: "/examples",
  },
};

export default function ExamplesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Example Prompts</h1>
      <p className="mt-4 text-muted-foreground">
        Curated SEO prompt examples for different project types. Coming soon.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        Back to Generator
      </Link>
    </div>
  );
}
