import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import { SITE_NAME } from "@/lib/product";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/generate", label: "Generate a prompt" },
      { href: "/examples", label: "Examples" },
      { href: "/pricing", label: "Pricing" },
      { href: "/how", label: "How it works" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/docs", label: "Documentation" },
      { href: "/help", label: "Help centre" },
      { href: "mailto:support@seopromptai.com", label: "Email support" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-surface-muted" role="contentinfo">
      <div className="shell py-14">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,1fr))]">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              One structured, copy-ready SEO prompt for your page. No sign-up, no
              subscription, no tracking.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {column.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {year} {SITE_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built by{" "}
            <Link
              href="https://suhailroushan.com"
              target="_blank"
              rel="noopener"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Suhail Roushan
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
