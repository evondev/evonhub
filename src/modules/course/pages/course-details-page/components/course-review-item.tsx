import type { RatingItemData } from "@/modules/rating/types";
import { formatShortDate } from "@/modules/course/utils";
import Image from "next/image";
import CourseRatingStars from "./course-rating-stars";

export interface CourseReviewItemProps {
  review: RatingItemData;
}

export default function CourseReviewItem({ review }: CourseReviewItemProps) {
  const reviewerName = review.user?.name || review.user?.username || "Học viên";
  const reviewerInitial = reviewerName.charAt(0).toLocaleUpperCase("vi");

  return (
    <li className="flex items-start gap-3 px-4 py-4 sm:px-5">
      {review.user?.avatar && (
        <Image
          src={review.user.avatar}
          alt=""
          width={32}
          height={32}
          className="size-8 shrink-0 rounded-full object-cover ring-1 ring-black/5"
        />
      )}
      {!review.user?.avatar && (
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sm font-semibold text-sky-700 ring-1 ring-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:ring-sky-500/30">
          {reviewerInitial}
        </span>
      )}
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
