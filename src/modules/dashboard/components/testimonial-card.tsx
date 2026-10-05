import { RatingItemData } from "@/modules/rating/types";
import { cn } from "@/shared/utils";
import { Star } from "lucide-react";
import Image from "next/image";
import { getFirstName } from "../utils";

interface TestimonialCardProps {
  rating: RatingItemData;
}

const STAR_POSITIONS = [1, 2, 3, 4, 5];

export function TestimonialCard({ rating }: TestimonialCardProps) {
  const authorName = rating.user?.name || rating.user?.username || "Học viên";
  // Chỉ có khi fetchRatingsPublic populate thêm course
  const courseTitle = rating.course?.title;

  return (
    <figure className="flex min-w-0 flex-col gap-3 rounded-2xl border border-border bg-surface p-4 sm:p-5">
      {rating.rating > 0 && (
        <div
          className="flex items-center gap-0.5"
          aria-label={`${rating.rating} trên 5 sao`}
        >
          {STAR_POSITIONS.map((position) => (
            <Star
              key={position}
              className={cn(
                "size-3.5",
                position <= rating.rating && "fill-current text-amber-500",
                position > rating.rating && "text-foreground/20",
              )}
            />
          ))}
        </div>
      )}
      <blockquote className="line-clamp-4 text-pretty text-sm text-foreground">
        {rating.content}
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-2.5">
        {rating.user?.avatar ? (
          <Image
            width={32}
            height={32}
            alt=""
            src={rating.user.avatar}
            className="size-8 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold uppercase text-primary-strong">
            {getFirstName(authorName).charAt(0)}
          </span>
        )}
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-foreground">
            {authorName}
          </span>
          {courseTitle && (
            <span className="block truncate text-xs text-muted">
              Học {courseTitle}
            </span>
          )}
        </span>
      </figcaption>
    </figure>
  );
}
