import { RatingItemData } from "@/modules/rating/types";
import { RatingStars } from "./rating-stars";
import { TestimonialAvatar } from "./testimonial-avatar";

interface TestimonialCardProps {
  rating: RatingItemData;
}

export function TestimonialCard({ rating }: TestimonialCardProps) {
  const authorName = rating.user?.name || rating.user?.username || "Học viên";

  return (
    <figure className="flex min-w-0 flex-col gap-3 rounded-2xl border border-border bg-surface p-4 sm:p-5">
      {rating.rating > 0 && <RatingStars rating={rating.rating} />}
      <blockquote className="line-clamp-3 text-pretty text-sm text-foreground">
        {rating.content}
      </blockquote>
      <figcaption className="flex items-center gap-2.5">
        <TestimonialAvatar
          name={authorName}
          avatar={rating.user?.avatar}
          size={32}
        />
        <span className="min-w-0 truncate text-sm font-semibold text-foreground">
          {authorName}
        </span>
      </figcaption>
    </figure>
  );
}
