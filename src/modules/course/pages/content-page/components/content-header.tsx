import { formatDurationMinutes } from "@/modules/course/utils";
import Link from "next/link";
import type { CourseContentStats } from "../types";

export interface ContentHeaderProps {
  title: string;
  stats: CourseContentStats;
}

export function ContentHeader({ title, stats }: ContentHeaderProps) {
  const hasLessons = stats.lessonCount > 0;
  const hasMissingVideo = stats.missingVideoCount > 0;

  return (
    <header className="min-w-0">
      {/* Chỉ ghi cấp cha, tên khóa học là h1 ngay dưới */}
      <nav aria-label="Đường dẫn">
        <ol className="flex items-center gap-2 text-sm text-muted">
          <li>
            <Link
              href="/admin/course/manage"
              className="inline-flex h-8 items-center transition-colors hover:text-foreground"
            >
              Quản lý khóa học
            </Link>
          </li>
        </ol>
      </nav>
      <h1 className="text-balance text-xl font-semibold text-foreground">
        {title}
      </h1>
      <p className="mt-1 text-pretty text-sm tabular-nums text-muted">
        {stats.chapterCount} chương · {stats.lessonCount} bài
        {hasLessons && ` · ${formatDurationMinutes(stats.totalMinutes)}`}
        {hasMissingVideo && (
          <>
            {" · "}
            <span className="whitespace-nowrap font-medium text-amber-700 dark:text-amber-400">
              {stats.missingVideoCount} bài chưa có video
            </span>
          </>
        )}
      </p>
    </header>
  );
}
