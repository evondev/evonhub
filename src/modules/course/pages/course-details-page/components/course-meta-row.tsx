import { formatDurationMinutes, formatRating } from "@/modules/course/utils";
import type { CourseCurriculumStats } from "@/modules/course/types";
import { COURSE_LEVEL_LABELS } from "@/shared/constants/course.constants";
import type { CourseLevel } from "@/shared/constants/course.constants";
import { Star } from "lucide-react";
import { Fragment } from "react";

export interface CourseMetaRowProps {
  ratingAverage: number;
  ratingCount: number;
  level: CourseLevel;
  stats: CourseCurriculumStats;
}

/** "4,8 ★ (6 đánh giá) · Trình độ Cơ bản · 55 bài · 11 giờ 57 phút" */
export default function CourseMetaRow({
  ratingAverage,
  ratingCount,
  level,
  stats,
}: CourseMetaRowProps) {
  const levelLabel = COURSE_LEVEL_LABELS[level];
  const metaItems: React.ReactNode[] = [];

  if (ratingCount > 0) {
    metaItems.push(
      <span className="inline-flex items-center gap-1">
        <span className="font-semibold tabular-nums text-foreground">
          {formatRating(ratingAverage)}
        </span>
        <Star className="size-4 fill-amber-500 text-amber-500" aria-hidden />
        <span className="tabular-nums">({ratingCount} đánh giá)</span>
      </span>,
    );
  }
  if (ratingCount === 0) metaItems.push(<span>Chưa có đánh giá</span>);
  if (levelLabel) metaItems.push(<span>Trình độ {levelLabel}</span>);
  if (stats.lessonCount > 0) {
    metaItems.push(
      <span className="tabular-nums">
        {stats.lessonCount} bài · {formatDurationMinutes(stats.totalMinutes)}
      </span>,
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
      {metaItems.map((metaItem, index) => (
        <Fragment key={index}>
          {index > 0 && <span aria-hidden="true">·</span>}
          {metaItem}
        </Fragment>
      ))}
    </div>
  );
}
