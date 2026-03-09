"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Sun, Moon, HelpCircle } from "lucide-react";

export function Navbar() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark =
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <nav
      className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-2"
          aria-label="SEO Prompt Generator home"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-foreground">
            <span className="text-xs font-bold text-background">S</span>
          </div>
          <span className="truncate text-sm font-semibold tracking-tight sm:max-w-[200px]">
            SEO Prompt Generator
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link
            href="/help"
            className="inline-flex min-h-9 min-w-9 items-center justify-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3"
            aria-label="Need help - how to use the form"
          >
            <HelpCircle className="h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden sm:inline">Need help</span>
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className="cursor-pointer rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
