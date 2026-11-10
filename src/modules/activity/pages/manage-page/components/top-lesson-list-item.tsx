import { cn, formatThoundsand } from "@/shared/utils";
import Link from "next/link";
import { ACTIVITY_TOP_RANK_HIGHLIGHT } from "../../../constants";
import { TopLessonRow } from "../../../types";
import { formatStudyMinutes } from "../../../utils";

interface TopLessonListItemProps {
  lesson: TopLessonRow;
}

const linkClassName = "underline-offset-4 hover:underline";

/** Hạng · tên bài · khoá · bên phải số người học, số phiên và tổng thời gian */
export function TopLessonListItem({ lesson }: TopLessonListItemProps) {
  const isHighlightedRank = lesson.rank <= ACTIVITY_TOP_RANK_HIGHLIGHT;

  return (
    <li className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-0 sm:px-5">
      <span
        aria-label={`Hạng ${lesson.rank}`}
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full bg-item-active text-sm tabular-nums",
          isHighlightedRank && "font-semibold text-foreground",
          !isHighlightedRank && "text-muted",
        )}
      >
        {lesson.rank}
      </span>
      <div className="min-w-0 flex-1">
        <p
          title={lesson.lessonTitle}
          className="truncate text-sm font-medium text-foreground"
        >
          {lesson.lessonHref && (
            // Tab mới: giữ nguyên bảng xếp hạng đang xem
            <Link
              href={lesson.lessonHref}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClassName}
            >
              {lesson.lessonTitle}
            </Link>
          )}
          {!lesson.lessonHref && lesson.lessonTitle}
        </p>
        <p className="mt-0.5 truncate text-xs text-muted">
          {lesson.courseHref && (
            <Link
              href={lesson.courseHref}
              title={lesson.courseTitle}
              className={cn(linkClassName, "hover:text-foreground")}
            >
              {lesson.courseTitle}
            </Link>
          )}
          {!lesson.courseHref && lesson.courseTitle}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-medium tabular-nums text-foreground">
          {formatThoundsand(lesson.learnerCount)} người học
        </p>
        <p className="mt-0.5 text-xs tabular-nums text-muted">
          {formatThoundsand(lesson.sessionCount)} phiên ·{" "}
          {formatStudyMinutes(lesson.totalStudyMinutes)}
        </p>
      </div>
    </li>
  );
}
