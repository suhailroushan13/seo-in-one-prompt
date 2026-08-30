"use client";

interface SegmentOption {
  value: string;
  label: string;
}

interface SegmentControlProps {
  options: readonly SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  labelledBy?: string;
}

export function SegmentControl({
  options,
  value,
  onChange,
  labelledBy,
}: SegmentControlProps) {
  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-surface-muted p-1 sm:grid-cols-4"
    >
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
              selected
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
