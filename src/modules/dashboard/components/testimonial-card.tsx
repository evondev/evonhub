import { RatingItemData } from "@/modules/rating/types";
import { UserAvatar } from "@/shared/components/common/user-avatar";
import { RatingStars } from "./rating-stars";

interface TestimonialCardProps {
  rating: RatingItemData;
}

export function TestimonialCard({ rating }: TestimonialCardProps) {
  const authorName = rating.user?.name || rating.user?.username || "Học viên";
  const courseTitle = rating.course?.title;

  return (
    <figure className="flex w-72 shrink-0 flex-col gap-3 rounded-2xl border border-border bg-surface p-4 sm:w-80 sm:p-5">
      <RatingStars rating={rating.rating} />
      <blockquote className="line-clamp-3 text-pretty text-sm leading-relaxed text-foreground">
        {rating.content}
      </blockquote>
      <figcaption className="mt-auto flex min-w-0 items-center gap-2.5">
        <UserAvatar name={authorName} avatar={rating.user?.avatar} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {authorName}
          </p>
          {courseTitle && (
            <p className="truncate text-xs text-muted">{courseTitle}</p>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
