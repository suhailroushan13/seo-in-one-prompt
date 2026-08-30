import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/product";

export function FinalCta() {
  return (
    <section className="pb-24">
      <div className="shell">
        <div className="card-surface grid-backdrop relative overflow-hidden px-6 py-14 text-center sm:px-10">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Stop guessing at SEO
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
            Two minutes of questions, {formatPrice()} once, and you walk away with
            an implementation plan your AI editor can execute today.
          </p>
          <Link href="/generate" className="btn btn-brand btn-lg mt-8">
            Generate my prompt
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
