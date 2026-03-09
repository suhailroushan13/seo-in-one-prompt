"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export function Footer() {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/views", { method: "POST" })
      .then((res) => res.json())
      .then((data) => setViews(typeof data.views === "number" ? data.views : null))
      .catch(() => setViews(null));
  }, []);

  return (
    <footer className="border-t border-border/50 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center gap-4 text-center">
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
          {/* {views !== null && (
            <p className="text-xs text-muted-foreground/70">
              Total views: {views.toLocaleString()}
            </p>
          )} */}
        </div>
      </div>
    </footer>
  );
}
