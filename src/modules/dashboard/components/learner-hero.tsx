"use client";

import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/shared/components/common";
import { CourseCover } from "@/shared/components/course";
import Skeleton from "@/shared/components/skeleton";
import { useResumeLessonUrl } from "@/shared/hooks";
import { Play } from "lucide-react";
import Link from "next/link";
import { useResumeLessonSummary } from "../hooks/use-resume-lesson-summary";
import { DashboardCourseProgress } from "../types";
import { getLearnerHeroStatusText, getResumeLessonLabel } from "../utils";

interface LearnerHeroProps {
  courseProgress: DashboardCourseProgress;
  firstName: string;
  /** Khóa này là bước mấy của lộ trình, nếu có */
  roadmapStepNumber?: number;
  roadmapStepCount: number;
}

/**
 * Thẻ trắng có ảnh bìa khóa: ảnh làm thẻ nổi, không cần mảng màu brand. Màn
 * rất rộng thì ảnh bên trái, còn lại ảnh thành dải trên đầu thẻ
 */
export function LearnerHero({
  courseProgress,
  firstName,
  roadmapStepNumber,
  roadmapStepCount,
}: LearnerHeroProps) {
  const { course, lesson, progress, current, total } = courseProgress;
  const lessonUrl = useResumeLessonUrl(course.slug, lesson);
  const resumeLesson = useResumeLessonSummary(course.slug, lesson);
  const greeting = firstName
    ? `Chào ${firstName}, học tiếp nhé`
    : "Học tiếp nhé";
  const statusText = getLearnerHeroStatusText(current, total);
  const isNotStarted = current === 0;

  return (
    <section className="grid min-w-0 grid-cols-1 overflow-hidden rounded-2xl border border-border bg-surface 2xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <CourseCover
        image={course.image}
        isPriority
        sizes="(min-width: 1536px) 40vw, (min-width: 1280px) 50vw, 100vw"
        className="aspect-[5/2] w-full 2xl:aspect-auto 2xl:h-full"
      />
      <div className="flex min-w-0 flex-col justify-between gap-6 p-5 sm:p-8">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted">{greeting}</p>
          <h2 className="mt-1 text-balance font-display text-2xl font-bold text-foreground sm:text-3xl">
            {course.title}
          </h2>
          <div className="mt-4 flex items-center gap-3">
            <ProgressBar
              progress={progress}
              className="h-2 bg-foreground/5 dark:bg-foreground/5"
              wrapperClassName="min-w-0 flex-1"
            />
            <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
              {current} / {total} bài
            </span>
          </div>
          <p className="mt-2 text-pretty text-sm text-muted">
            {statusText}
            {roadmapStepNumber &&
              ` · Bước ${roadmapStepNumber} / ${roadmapStepCount} của lộ trình`}
          </p>
        </div>
        <div className="flex min-w-0 flex-col gap-3 rounded-xl bg-item-hover p-4 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            {resumeLesson.isLoading && (
              <div aria-busy="true" className="space-y-2 py-0.5">
                <Skeleton className="h-3 w-24 rounded-full" />
                <Skeleton className="h-4 w-3/5 rounded-full" />
              </div>
            )}
            {!resumeLesson.isLoading && (
              <>
                <p className="text-xs text-muted">
                  {getResumeLessonLabel(
                    resumeLesson.isFirstLesson,
                    resumeLesson.duration,
                  )}
                </p>
                <p className="mt-0.5 line-clamp-2 text-sm font-semibold text-foreground">
                  {resumeLesson.title || "Mở lại bài bạn đang học"}
                </p>
              </>
            )}
          </div>
          <Button asChild variant="primary" className="shrink-0">
            <Link href={lessonUrl}>
              <Play className="size-4 shrink-0" />
              {isNotStarted ? "Bắt đầu học" : "Học tiếp"}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
