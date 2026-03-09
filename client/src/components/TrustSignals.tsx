export function TrustSignals() {
  return (
    <section className="py-12 text-center">
      <p className="text-sm font-medium text-muted-foreground">
        Used by 200+ builders launching SEO optimized products
      </p>
      <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex h-8 w-16 items-center justify-center rounded-md bg-muted/60 text-[10px] font-medium text-muted-foreground/50"
          >
            LOGO
          </div>
        ))}
      </div>
    </section>
  );
}
