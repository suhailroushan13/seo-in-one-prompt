import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: "/generate", label: "Generate a prompt" },
  { href: "/examples", label: "See an example" },
  { href: "/pricing", label: "Pricing" },
  { href: "/help", label: "Help" },
];

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p aria-hidden className="tabular text-7xl font-semibold tracking-tight text-border-strong">
        404
      </p>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 max-w-sm text-sm text-muted-foreground">
        That page does not exist, or it moved. Here is where most people are
        heading.
      </p>
      <ul className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {LINKS.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="btn btn-outline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/" className="btn btn-brand mt-6">
        Back to home
      </Link>
    </div>
  );
}
