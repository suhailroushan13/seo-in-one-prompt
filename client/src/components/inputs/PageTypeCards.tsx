"use client";

import {
  BookOpen,
  FileText,
  LayoutDashboard,
  Rocket,
  ShoppingCart,
  User,
} from "lucide-react";
import type { PAGE_TYPE_OPTIONS } from "@/lib/types";

type PageTypeOption = (typeof PAGE_TYPE_OPTIONS)[number];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Rocket,
  FileText,
  User,
  ShoppingCart,
  LayoutDashboard,
  BookOpen,
};

interface PageTypeCardsProps {
  options: readonly PageTypeOption[];
  value: string;
  onChange: (value: string) => void;
  labelledBy?: string;
}

export function PageTypeCards({
  options,
  value,
  onChange,
  labelledBy,
}: PageTypeCardsProps) {
  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      className="grid grid-cols-2 gap-2 sm:grid-cols-3"
    >
      {options.map((opt) => {
        const Icon = iconMap[opt.icon];
        const selected = value === opt.label;
        return (
          <button
            key={opt.label}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.label)}
            className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center transition-colors ${
              selected
                ? "border-brand bg-brand-muted text-foreground"
                : "border-border hover:border-border-strong hover:bg-surface-muted"
            }`}
          >
            {Icon && (
              <Icon
                aria-hidden
                className={`h-5 w-5 ${selected ? "text-brand" : "text-muted-foreground"}`}
              />
            )}
            <span
              className={`text-xs font-medium ${
                selected ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
