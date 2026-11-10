import { cn } from "@/shared/utils";
import { GRID_TICK_CLASS_NAME } from "../constants";
import { LandingFeature } from "../types";
import { SpotlightOverlay } from "./spotlight-overlay";

interface LandingFeatureCardProps {
  feature: LandingFeature;
}

export function LandingFeatureCard({ feature }: LandingFeatureCardProps) {
  const FeatureIcon = feature.icon;

  return (
    <div className="group relative isolate flex flex-col gap-3 overflow-hidden p-6 sm:p-8">
      <SpotlightOverlay />
      <span className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300 shadow-[0_0_24px_-6px_rgb(139_92_246/0.8)] ring-1 ring-inset ring-violet-400/30 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110 motion-reduce:transform-none">
        <FeatureIcon className="size-5" />
      </span>
      <h3
        className={cn(
          GRID_TICK_CLASS_NAME,
          "mt-2 text-base font-semibold text-foreground",
        )}
      >
        {feature.title}
      </h3>
      <p className="text-pretty text-sm leading-6 text-muted">
        {feature.description}
      </p>
    </div>
  );
}
