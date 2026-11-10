import { RatingItemData } from "@/modules/rating/types";
import { UserAvatar } from "@/shared/components/common/user-avatar";
import { Star } from "lucide-react";

interface LandingTestimonialCardProps {
  rating: RatingItemData;
}

/** Một đánh giá thật của học viên, cao theo độ dài nội dung (lưới so le) */
export function LandingTestimonialCard({
  rating,
}: LandingTestimonialCardProps) {
  const authorName = rating.user?.name || rating.user?.username || "Học viên";
  const courseTitle = rating.course?.title;

  return (
    <figure className="reveal-on-scroll mb-4 flex break-inside-avoid flex-col gap-4 rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex gap-0.5" aria-label={`${rating.rating} trên 5 sao`}>
        {Array.from({ length: rating.rating }, (_, starIndex) => (
          <Star
            key={starIndex}
            className="size-4 fill-amber-500 text-amber-500"
          />
        ))}
      </div>
      <blockquote className="text-pretty text-sm leading-6 text-foreground">
        {rating.content}
      </blockquote>
      <figcaption className="flex min-w-0 items-center gap-3">
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
