import { getLessonPreviewHref } from "@/modules/course/utils";
import { CirclePlay } from "lucide-react";
import Link from "next/link";

export interface CourseCurriculumLessonProps {
  id: string;
  title: string;
  duration?: number;
  courseSlug: string;
  /** Bài học thử và người xem chưa sở hữu khóa: hiện link "Học thử" */
  shouldShowTrial: boolean;
}

export default function CourseCurriculumLesson({
  id,
  title,
  duration,
  courseSlug,
  shouldShowTrial,
}: CourseCurriculumLessonProps) {
  return (
    <li className="flex items-start gap-3 py-2 text-sm">
      <CirclePlay className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
      <span className="min-w-0 flex-1 text-pretty text-foreground/80">
        {title}
      </span>
      {shouldShowTrial && (
        <Link
          href={getLessonPreviewHref(courseSlug, id)}
          target="_blank"
          rel="noreferrer"
          // Vùng bấm nới ra 8px mỗi phía: chữ chỉ cao 20px, dưới ngưỡng ngón tay
          className="relative shrink-0 font-medium text-primary-strong underline-offset-4 after:absolute after:-inset-2 hover:underline"
        >
          Học thử
        </Link>
      )}
      {Number(duration) > 0 && (
        <span className="w-14 shrink-0 text-right tabular-nums text-muted">
          {duration} phút
        </span>
      )}
    </li>
  );
}
