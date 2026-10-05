import { formatRating } from "@/modules/course/utils";
import type { RatingItemData } from "@/modules/rating/types";
import CourseRatingStars from "./course-rating-stars";
import CourseReviewItem from "./course-review-item";
import CourseSection from "./course-section";

export interface CourseReviewsProps {
  reviews: RatingItemData[];
  ratingAverage: number;
}

export default function CourseReviews({
  reviews,
  ratingAverage,
}: CourseReviewsProps) {
  const ratingSummary = reviews.length > 0 && (
    <span className="inline-flex shrink-0 items-center gap-1.5 text-sm text-muted">
      <span className="font-display text-2xl font-semibold tabular-nums text-foreground">
        {formatRating(ratingAverage)}
      </span>
      <span className="hidden sm:inline-flex">
        <CourseRatingStars value={ratingAverage} className="size-4" />
      </span>
      <span className="tabular-nums">{reviews.length} đánh giá</span>
    </span>
  );

  return (
    <CourseSection title="Đánh giá" action={ratingSummary}>
      {reviews.length === 0 && (
        <div className="rounded-2xl border border-border bg-surface px-5 py-10 text-center text-sm text-muted">
          Chưa có đánh giá nào
        </div>
      )}
      {reviews.length > 0 && (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
          {reviews.map((review) => (
            <CourseReviewItem key={review._id} review={review} />
          ))}
        </ul>
      )}
    </CourseSection>
  );
}
