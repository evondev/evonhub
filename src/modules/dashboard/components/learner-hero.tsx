"use client";

import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/shared/components/common";
import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useResumeLessonUrl } from "../hooks/use-resume-lesson-url";
import { DashboardCourseProgress } from "../types";

interface LearnerHeroProps {
  courseProgress: DashboardCourseProgress;
  firstName: string;
  /** Khóa này là bước mấy của lộ trình, nếu có */
  roadmapStepNumber?: number;
}

export function LearnerHero({
  courseProgress,
  firstName,
  roadmapStepNumber,
}: LearnerHeroProps) {
  const { course, lesson, progress, current, total } = courseProgress;
  const lessonUrl = useResumeLessonUrl(course.slug, lesson);
  const greeting = firstName
    ? `Chào ${firstName}, học tiếp nhé`
    : "Học tiếp nhé";

  return (
    <section className="flex flex-col gap-5 rounded-2xl bg-brand-band bg-gradient-to-br from-brand-band to-brand-band-end p-5 text-white sm:flex-row sm:items-center sm:p-6">
      {course.image && (
        <Image
          src={course.image}
          alt=""
          width={480}
          height={270}
          sizes="240px"
          priority
          className="hidden aspect-video w-60 shrink-0 rounded-xl object-cover ring-1 ring-white/20 sm:block"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white">{greeting}</p>
        <h2 className="mt-1 text-balance text-xl font-semibold">
          {course.title}
        </h2>
        <div className="mt-4 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <ProgressBar
              progress={progress}
              className="h-2 bg-white/25 dark:bg-white/25"
              fillClassName="bg-white"
            />
          </div>
          <p className="shrink-0 text-sm font-semibold tabular-nums">
            {progress}%
          </p>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white">
            {current} / {total} bài
            {roadmapStepNumber && ` · Bước ${roadmapStepNumber} của lộ trình`}
          </p>
          <Button
            asChild
            className="bg-surface text-foreground hover:bg-surface/85 dark:hover:bg-surface/70"
          >
            <Link href={lessonUrl}>
              <Play className="size-4 shrink-0" />
              Học tiếp
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
