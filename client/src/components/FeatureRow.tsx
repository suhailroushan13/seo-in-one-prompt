import {
  Zap,
  Target,
  FileText,
  Tags,
  Link2,
  CheckSquare,
} from "lucide-react";

const features = [
  { icon: Zap, label: "Instant generation" },
  { icon: Target, label: "Keyword strategy" },
  { icon: FileText, label: "Content structure" },
  { icon: Tags, label: "Meta tags" },
  { icon: Link2, label: "Internal linking" },
  { icon: CheckSquare, label: "SEO checklist" },
];

export function FeatureRow() {
  return (
    <section className="border-y border-border/40 bg-muted/30">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-4 px-4 py-5 sm:px-6">
        {features.map((f) => (
          <div
            key={f.label}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <f.icon className="h-4 w-4" />
            <span>{f.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
