import { cn } from "@/shared/utils";
import {
  LANDING_CONTAINER_CLASS_NAME,
  LANDING_SECTION_CLASS_NAME,
  LANDING_SECTION_IDS,
  landingFeatures,
} from "../constants";
import { LandingFeatureCard } from "./landing-feature-card";
import { LandingSectionHeading } from "./landing-section-heading";

/** Cách học ở EvonHub: lưới sáu ô kẻ đường tóc */
export function LandingFeatures() {
  return (
    <section
      id={LANDING_SECTION_IDS.features}
      className={cn(LANDING_SECTION_CLASS_NAME, LANDING_CONTAINER_CLASS_NAME)}
    >
      <LandingSectionHeading
        eyebrow="Cách học"
        title="Không chỉ xem video."
        mutedTitle="Học tới lúc tự làm được."
        isCentered
      />
      <div className="reveal-on-scroll mt-12 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
        {landingFeatures.map((feature) => (
          <LandingFeatureCard key={feature.title} feature={feature} />
        ))}
      </div>
    </section>
  );
}
