"use client";

interface SegmentOption {
  value: string;
  label: string;
}

interface SegmentControlProps {
  options: readonly SegmentOption[];
  value: string;
  onChange: (value: string) => void;
}

export function SegmentControl({
  options,
  value,
  onChange,
}: SegmentControlProps) {
  return (
    <div className="flex flex-wrap gap-1.5 rounded-lg border border-border bg-muted/40 p-1">
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all sm:text-sm ${
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
