import { formatDurationMinutes, formatRating } from "@/modules/course/utils";
import {
  COURSE_LEVEL_LABELS,
  type CourseLevel,
} from "@/shared/constants/course.constants";
import { Star } from "lucide-react";
import { Fragment } from "react";

export interface VideoDetailsHeaderProps {
  title: string;
  level: CourseLevel;
  durationMinutes: number;
  ratingAverage: number;
  ratingCount: number;
}

/** Tên video và dòng "4,8 ★ (6 đánh giá) · Cơ bản · 12 phút" */
export function VideoDetailsHeader({
  title,
  level,
  durationMinutes,
  ratingAverage,
  ratingCount,
}: VideoDetailsHeaderProps) {
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
  if (levelLabel) metaItems.push(<span>{levelLabel}</span>);
  if (durationMinutes > 0) {
    metaItems.push(
      <span className="tabular-nums">
        {formatDurationMinutes(durationMinutes)}
      </span>,
    );
  }

  return (
    <header className="min-w-0">
      <h1 className="font-display text-xl font-semibold text-balance text-foreground sm:text-2xl">
        {title}
      </h1>
      {metaItems.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          {metaItems.map((metaItem, index) => (
            <Fragment key={index}>
              {index > 0 && <span aria-hidden="true">·</span>}
              {metaItem}
            </Fragment>
          ))}
        </div>
      )}
    </header>
  );
}
