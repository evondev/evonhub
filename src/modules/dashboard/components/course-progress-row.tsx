"use client";

import { ProgressBar } from "@/shared/components/common";
import { cn } from "@/shared/utils";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useResumeLessonUrl } from "../hooks/use-resume-lesson-url";
import { DashboardCourseProgress } from "../types";

interface CourseProgressRowProps {
  courseProgress: DashboardCourseProgress;
}

export function CourseProgressRow({ courseProgress }: CourseProgressRowProps) {
  const { course, lesson, progress, current, total } = courseProgress;
  const lessonUrl = useResumeLessonUrl(course.slug, lesson);
  const isNotStarted = current === 0;

  return (
    <li>
      <Link
        href={lessonUrl}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 outline-none transition-colors hover:bg-item-hover"
      >
        {course.image ? (
          <Image
            src={course.image}
            alt=""
            width={96}
            height={96}
            sizes="48px"
            className="size-12 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-foreground/5 text-muted">
            <ImageIcon className="size-4" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <p
              className="min-w-0 flex-1 truncate text-sm font-medium text-foreground"
              title={course.title}
            >
              {course.title}
            </p>
            <p
              className={cn(
                "shrink-0 text-sm font-medium tabular-nums",
                isNotStarted && "text-muted",
                !isNotStarted && "text-foreground",
              )}
            >
              {progress}%
            </p>
          </div>
          <div className="mt-2">
            <ProgressBar
              progress={progress}
              className="h-1.5 bg-foreground/5 dark:bg-foreground/5"
            />
          </div>
          <p className="mt-1.5 truncate text-xs text-muted">
            {isNotStarted && "Chưa bắt đầu · "}
            {current} / {total} bài
          </p>
        </div>
      </Link>
    </li>
  );
}
