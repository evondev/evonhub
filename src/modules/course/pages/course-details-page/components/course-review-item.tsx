import type { RatingItemData } from "@/modules/rating/types";
import { formatShortDate } from "@/modules/course/utils";
import { UserAvatar } from "@/shared/components/common/user-avatar";
import CourseRatingStars from "./course-rating-stars";

export interface CourseReviewItemProps {
  review: RatingItemData;
}

export default function CourseReviewItem({ review }: CourseReviewItemProps) {
  const reviewerName = review.user?.name || review.user?.username || "Học viên";

  return (
    <li className="flex items-start gap-3 px-4 py-4 sm:px-5">
      <UserAvatar name={reviewerName} avatar={review.user?.avatar} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-sm font-medium text-foreground">
            {reviewerName}
          </span>
          <CourseRatingStars value={review.rating} />
          <span className="text-xs tabular-nums text-muted">
            {formatShortDate(review.createdAt)}
          </span>
        </div>
        <p className="mt-1 text-pretty text-sm/6 text-foreground/80">
          {review.content}
        </p>
      </div>
    </li>
  );
}
