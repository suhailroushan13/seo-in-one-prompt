"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const footerLinks = [
  { href: "/generate", label: "Generate" },
  { href: "/help", label: "Help" },
  { href: "/examples", label: "Examples" },
  { href: "/docs", label: "Docs" },
  { href: "/pricing", label: "Pricing" },
];

export function Footer() {
  const [, setViews] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/views", { method: "POST" })
      .then((res) => res.json())
      .then((data) => setViews(typeof data.views === "number" ? data.views : null))
      .catch(() => setViews(null));
  }, []);

  return (
    <footer
      className="border-t border-border/50 bg-muted/20"
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {footerLinks.map((link) => (
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
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Free tool to generate SEO prompts. No sign-up, no tracking.
            </p>
            <p className="text-sm text-muted-foreground">
              Built by{" "}
              <Link
                href="https://suhailroushan.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Suhail Roushan
              </Link>
            </p>
          </div>
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} SEO Prompt Generator. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
