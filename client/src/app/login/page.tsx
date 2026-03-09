import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Log In",
  description:
    "Sign in to access your saved SEO prompts and unlimited generations.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
      <p className="mt-4 text-muted-foreground">
        Sign in to access your saved prompts and unlimited generations.
      </p>
      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">Authentication coming soon.</p>
      </div>
      <Link
        href="/"
        className="mt-6 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        Back to Generator
      </Link>
    </div>
  );
}
