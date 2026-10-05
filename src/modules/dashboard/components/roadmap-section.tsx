import { cn } from "@/shared/utils";
import { ROADMAP_SUBTITLE } from "../constants";
import { RoadmapStep } from "../types";
import { findNextRoadmapStep } from "../utils";
import { RoadmapStepCard } from "./roadmap-step-card";
import { SectionHeading } from "./section-heading";

interface RoadmapSectionProps {
  steps: RoadmapStep[];
}

export function RoadmapSection({ steps }: RoadmapSectionProps) {
  // Nổi bước đầu tiên chưa xong: người mới là bước 1, học viên là bước đang tới
  const highlightedStep = findNextRoadmapStep(steps);

  return (
    <section id="lo-trinh" className="flex scroll-mt-20 flex-col gap-4">
      <SectionHeading
        title={`Lộ trình ${steps.length} bước`}
        subtitle={ROADMAP_SUBTITLE}
      />
      <ol
        className={cn(
          "grid gap-0 md:gap-6",
          steps.length === 2 && "md:grid-cols-2",
          steps.length === 3 && "md:grid-cols-3",
          steps.length >= 4 && "md:grid-cols-2 xl:grid-cols-4",
        )}
      >
        {steps.map((step, index) => (
          <RoadmapStepCard
            key={step.slug}
            step={step}
            isHighlighted={step.slug === highlightedStep?.slug}
            isLastStep={index === steps.length - 1}
          />
        ))}
      </ol>
    </section>
  );
}
