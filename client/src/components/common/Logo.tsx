import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="group flex min-w-0 shrink-0 items-center gap-2.5 rounded-lg"
      aria-label="SEO Prompt Generator — home"
    >
      <span
        aria-hidden
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-brand text-brand-foreground shadow-sm transition-transform group-hover:scale-105"
      >
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </span>
      {!compact && (
        <span className="truncate text-[15px] font-semibold tracking-tight">
          SEO Prompt
          <span className="text-muted-foreground"> Generator</span>
        </span>
      )}
    </Link>
  );
}
