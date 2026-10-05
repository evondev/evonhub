import { Star } from "lucide-react";
import { formatRating, getAverageRating } from "../utils";

interface CourseRatingProps {
  ratings?: number[];
  /** Ghi thêm số lượt đánh giá "(12)", từ sm trở lên */
  shouldShowCount?: boolean;
}

/** Sao trung bình của khóa; khóa chưa có đánh giá thì không hiện gì */
export function CourseRating({
  ratings = [],
  shouldShowCount = false,
}: CourseRatingProps) {
  if (ratings.length === 0) return null;

  return (
    <span className="inline-flex shrink-0 items-center gap-1 text-xs tabular-nums text-muted">
      <Star className="size-3.5 fill-amber-500 text-amber-500" />
      {formatRating(getAverageRating(ratings))}
      {shouldShowCount && (
        <span className="hidden sm:inline">({ratings.length})</span>
      )}
    </span>
  );
}
