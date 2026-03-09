"use client";

import {
  Rocket,
  FileText,
  User,
  ShoppingCart,
  LayoutDashboard,
  BookOpen,
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
}

export function PageTypeCards({ options, value, onChange }: PageTypeCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {options.map((opt) => {
        const Icon = iconMap[opt.icon];
        const selected = value === opt.label;
        return (
          <button
            key={opt.label}
            type="button"
            onClick={() => onChange(opt.label)}
            className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center transition-all ${
              selected
                ? "border-foreground/30 bg-foreground/5 shadow-sm"
                : "border-border hover:border-foreground/20 hover:bg-muted/50"
            }`}
          >
            {Icon && (
              <Icon
                className={`h-5 w-5 ${
                  selected ? "text-foreground" : "text-muted-foreground"
                }`}
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
