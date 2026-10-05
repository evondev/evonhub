import { ChevronRight } from "lucide-react";
import { Fragment } from "react";
import { RoadmapStep } from "../types";
import { getRoadmapSubtitle } from "../utils";
import { RoadmapStepCard } from "./roadmap-step-card";
import { SectionHeading } from "./section-heading";

interface RoadmapSectionProps {
  steps: RoadmapStep[];
  isLearner?: boolean;
}

export function RoadmapSection({
  steps,
  isLearner = false,
}: RoadmapSectionProps) {
  if (steps.length === 0) return null;

  const currentStep = steps.find((step) => {
    const progress = step.courseProgress?.progress || 0;

    return Boolean(step.courseProgress?.current) && progress < 100;
  });

  return (
    <section id="lo-trinh" className="flex scroll-mt-20 flex-col gap-3">
      <SectionHeading
        title={isLearner ? "Lộ trình của bạn" : "Lộ trình từ con số 0"}
        subtitle={
          isLearner
            ? getRoadmapSubtitle(steps)
            : `${steps.length} khóa, học theo thứ tự này để làm được sản phẩm thật`
        }
      />
      <ol className="grid gap-3 sm:grid-cols-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]">
        {steps.map((step, index) => (
          <Fragment key={step.slug}>
            {index > 0 && (
              <li
                aria-hidden="true"
                className="hidden items-center text-foreground/25 lg:flex"
              >
                <ChevronRight className="size-5" />
              </li>
            )}
            <RoadmapStepCard
              step={step}
              isCurrentStep={step.slug === currentStep?.slug}
            />
          </Fragment>
        ))}
      </ol>
    </section>
  );
}
