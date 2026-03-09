import { Hero } from "@/components/Hero";
import { FeatureRow } from "@/components/FeatureRow";

export default function Home() {
  return (
    <div className="min-h-full overflow-x-hidden">
      <Hero />
      <FeatureRow />
      {/* <TrustSignals /> */}
    </div>
  );
}
