import { formatRating, getAverageRating } from "@/modules/course/utils";
import { ProgressBar } from "@/shared/components/common";
import { cn } from "@/shared/utils";
import { formatThoundsand } from "@/utils";
import { CircleCheck, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { RoadmapStep } from "../types";

interface RoadmapStepCardProps {
  step: RoadmapStep;
  isCurrentStep: boolean;
}

export function RoadmapStepCard({ step, isCurrentStep }: RoadmapStepCardProps) {
  const { course, courseProgress } = step;
  const ratings = course.rating || [];
  const isCompleted = (courseProgress?.progress || 0) >= 100;
  const isNotStarted = courseProgress?.current === 0;

  return (
    <li className="min-w-0">
      <Link
        href={`/course/${course.slug}`}
        className={cn(
          "flex h-full min-w-0 gap-3 rounded-2xl border bg-surface p-3 outline-none transition-colors hover:border-border-strong sm:flex-col sm:gap-0 sm:p-4",
          isCurrentStep && "border-primary/40",
          !isCurrentStep && "border-border",
        )}
      >
        <div className="relative w-28 shrink-0 sm:w-full">
          <Image
            src={course.image}
            alt=""
            width={600}
            height={338}
            sizes="(min-width: 640px) 33vw, 112px"
            className="aspect-video w-full rounded-xl object-cover"
          />
          <span className="absolute left-1.5 top-1.5 inline-flex h-6 items-center rounded-full bg-surface px-2 text-xs font-medium text-foreground sm:left-2 sm:top-2 sm:px-2.5">
            Bước {step.stepNumber}
            {isCurrentStep && (
              <span className="hidden sm:inline">&nbsp;· đang học</span>
            )}
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="line-clamp-2 text-pretty text-base font-semibold text-foreground sm:mt-3">
            {step.shortTitle}
          </h3>
          <p className="mt-0.5 text-pretty text-sm text-muted sm:mt-1">
            {step.outcome}
          </p>
          <div className="mt-auto flex items-baseline justify-between gap-3 pt-2 sm:pt-4">
            {!courseProgress && (
              <>
                <span className="text-base font-semibold tabular-nums text-foreground">
                  {formatThoundsand(course.price)} đ
                </span>
                {ratings.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs tabular-nums text-muted">
                    <Star className="size-3.5 fill-current text-amber-500" />
                    {formatRating(getAverageRating(ratings))}
                  </span>
                )}
              </>
            )}
            {courseProgress && isCompleted && (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                <CircleCheck className="size-4" />
                Đã hoàn thành
              </span>
            )}
            {courseProgress && !isCompleted && isNotStarted && (
              <span className="text-sm text-muted">
                Chưa bắt đầu · {courseProgress.total} bài
              </span>
            )}
            {courseProgress && !isCompleted && !isNotStarted && (
              <div className="flex w-full items-center gap-3">
                <div className="min-w-0 flex-1">
                  <ProgressBar
                    progress={courseProgress.progress}
                    className="h-1.5 bg-foreground/5 dark:bg-foreground/5"
                  />
                </div>
                <span className="shrink-0 text-sm font-medium tabular-nums text-foreground">
                  {courseProgress.progress}%
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
}
