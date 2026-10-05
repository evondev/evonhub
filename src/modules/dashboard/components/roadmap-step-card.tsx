import { ProgressBar } from "@/shared/components/common";
import { cn } from "@/shared/utils";
import { Check } from "lucide-react";
import Link from "next/link";
import { RoadmapStep } from "../types";
import { CourseRating } from "./course-rating";
import { RoadmapStepStatus } from "./roadmap-step-status";

interface RoadmapStepCardProps {
  step: RoadmapStep;
  /** Bước nổi: bước 1 với người mới, bước đang học với học viên */
  isHighlighted: boolean;
  isLastStep: boolean;
}

export function RoadmapStepCard({
  step,
  isHighlighted,
  isLastStep,
}: RoadmapStepCardProps) {
  const { course, courseProgress } = step;
  const progress = courseProgress?.progress || 0;
  const isCompleted = progress >= 100;
  const isLearning = Boolean(courseProgress?.current) && !isCompleted;
  const cardClassName = cn(
    "flex min-w-0 flex-1 flex-col rounded-2xl border bg-surface p-4 sm:p-5",
    course && "outline-none transition-colors hover:border-border-strong",
    isHighlighted && "border-primary/50",
    !isHighlighted && "border-border",
  );
  const cardContent = (
    <>
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-xl",
            isHighlighted && "bg-primary/10 text-primary-strong",
            !isHighlighted && "bg-foreground/5 text-muted",
          )}
        >
          <step.icon className="size-5" />
        </span>
        <div className="min-w-0">
          <h3 className="text-pretty text-base font-semibold text-foreground">
            {step.shortTitle}
          </h3>
          <p className="mt-0.5 text-pretty text-sm text-muted">
            {step.outcome}
          </p>
        </div>
      </div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
        <RoadmapStepStatus step={step} />
        {course && !courseProgress && <CourseRating ratings={course.rating} />}
      </div>
      {isLearning && (
        <div className="mt-3 flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <ProgressBar
              progress={progress}
              className="h-2 bg-foreground/5 dark:bg-foreground/5"
            />
          </div>
          <span className="text-xs font-medium tabular-nums text-foreground">
            {progress}%
          </span>
        </div>
      )}
    </>
  );

  return (
    <li className="relative flex min-w-0 gap-4 pb-6 last:pb-0 md:flex-col md:gap-3 md:pb-0">
      {!isLastStep && (
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-[19px] top-10 w-0.5 bg-border-strong md:-right-3 md:bottom-auto md:left-10 md:top-[19px] md:h-0.5 md:w-auto"
        />
      )}
      <span
        className={cn(
          "relative z-10 grid size-10 shrink-0 place-items-center rounded-full text-sm font-semibold",
          isHighlighted && "bg-primary text-primary-foreground",
          !isHighlighted &&
            "border-2 border-border-strong bg-surface text-muted",
        )}
      >
        {isCompleted ? <Check className="size-4" /> : step.stepNumber}
      </span>
      {course ? (
        <Link href={`/course/${course.slug}`} className={cardClassName}>
          {cardContent}
        </Link>
      ) : (
        <div className={cardClassName}>{cardContent}</div>
      )}
    </li>
  );
}
