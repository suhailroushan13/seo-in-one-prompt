import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Pricing</h1>
      <p className="mt-4 text-muted-foreground">
        Free to start. Upgrade for unlimited prompts and advanced features. Coming soon.
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
