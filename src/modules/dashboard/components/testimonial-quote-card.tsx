import { RatingItemData } from "@/modules/rating/types";
import { Quote } from "lucide-react";
import { RatingStars } from "./rating-stars";
import { TestimonialAvatar } from "./testimonial-avatar";

interface TestimonialQuoteCardProps {
  rating: RatingItemData;
}

/** Cảm nhận lớn, đứng đầu khối "Học viên nói gì" */
export function TestimonialQuoteCard({ rating }: TestimonialQuoteCardProps) {
  const authorName = rating.user?.name || rating.user?.username || "Học viên";

  return (
    <figure className="flex min-w-0 flex-col justify-between gap-6 rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <Quote className="size-8 text-primary-strong" />
      <blockquote className="line-clamp-6 text-pretty text-lg font-medium text-foreground sm:text-xl">
        {rating.content}
      </blockquote>
      <figcaption className="flex items-center gap-3">
        <TestimonialAvatar
          name={authorName}
          avatar={rating.user?.avatar}
          size={40}
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {authorName}
          </p>
          {rating.rating > 0 && <RatingStars rating={rating.rating} />}
        </div>
      </figcaption>
    </figure>
  );
}
