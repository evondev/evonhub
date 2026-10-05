"use client";

import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import Link from "next/link";
import { useResumeLessonUrl } from "@/shared/hooks";
import { DashboardCourseProgress } from "../types";

interface LearnerHeroProps {
  courseProgress: DashboardCourseProgress;
  firstName: string;
  hasRoadmap: boolean;
  /** Khóa này là bước mấy của lộ trình, nếu có */
  roadmapStepNumber?: number;
  roadmapStepCount: number;
}

export function LearnerHero({
  courseProgress,
  firstName,
  hasRoadmap,
  roadmapStepNumber,
  roadmapStepCount,
}: LearnerHeroProps) {
  const { course, lesson, progress, current, total } = courseProgress;
  const lessonUrl = useResumeLessonUrl(course.slug, lesson);
  const greeting = firstName
    ? `Chào ${firstName}, học tiếp nhé`
    : "Học tiếp nhé";
  const nextLessonText =
    current === 0
      ? "Chưa bắt đầu, vào học bài đầu tiên"
      : `Tiếp tục từ bài ${Math.min(current + 1, total)}`;

  return (
    <section className="grid gap-6 rounded-2xl bg-brand-band bg-gradient-to-br from-brand-band to-brand-band-end p-5 text-white sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:items-center [&_a:focus-visible]:outline-white">
      <div className="min-w-0">
        <p className="text-sm font-medium">{greeting}</p>
        <h2 className="mt-1 text-balance text-2xl font-bold sm:text-3xl">
          {course.title}
        </h2>
        <p className="mt-2 text-pretty text-sm sm:text-base">
          {nextLessonText}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button
            asChild
            className="bg-surface text-foreground hover:bg-surface/85 dark:hover:bg-surface/70"
          >
            <Link href={lessonUrl}>
              <Play className="size-4 shrink-0" />
              Học tiếp
            </Link>
          </Button>
          {hasRoadmap && (
            <Button
              asChild
              className="text-white ring-1 ring-inset ring-white/40 hover:bg-white/15"
            >
              <Link href="#lo-trinh">Xem lộ trình</Link>
            </Button>
          )}
        </div>
      </div>
      <div className="min-w-0 rounded-xl bg-black/15 p-4 ring-1 ring-white/15">
        <div className="flex items-baseline justify-between text-sm">
          <span>Tiến độ</span>
          <span className="font-semibold tabular-nums">
            {current} / {total} bài
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-2 h-2 overflow-hidden rounded-full bg-white/20"
        >
          <div
            className="h-full rounded-full bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>
        {roadmapStepNumber && (
          <p className="mt-3 text-xs">
            Bước {roadmapStepNumber} / {roadmapStepCount} của lộ trình
          </p>
        )}
      </div>
    </section>
  );
}
