"use client";

import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/shared/components/common";
import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useResumeLessonUrl } from "../hooks/use-resume-lesson-url";
import { DashboardCourseProgress } from "../types";

interface ResumeHeroProps {
  courseProgress: DashboardCourseProgress;
  firstName: string;
}

export function ResumeHero({ courseProgress, firstName }: ResumeHeroProps) {
  const { course, lesson, progress, current, total } = courseProgress;
  const lessonUrl = useResumeLessonUrl(course.slug, lesson);
  const greeting = firstName
    ? `Chào ${firstName}, học tiếp bài đang dở nhé`
    : "Học tiếp bài đang dở nhé";

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5">
      {course.image && (
        <div className="relative hidden w-60 shrink-0 sm:block">
          <Image
            src={course.image}
            alt=""
            width={480}
            height={270}
            sizes="240px"
            priority
            className="aspect-video w-full rounded-xl object-cover"
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted">{greeting}</p>
        <h2 className="mt-1 text-balance text-lg font-semibold text-foreground">
          {course.title}
        </h2>
        <div className="mt-4 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <ProgressBar
              progress={progress}
              className="h-2 bg-foreground/5 dark:bg-foreground/5"
            />
          </div>
          <p className="shrink-0 text-sm font-medium tabular-nums text-foreground">
            {progress}%
          </p>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            {current} / {total} bài
          </p>
          <Button asChild variant="primary">
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
