import { RATING_STAR_POSITIONS } from "@/modules/course/constants";
import { cn } from "@/shared/utils";
import { Star } from "lucide-react";

export interface CourseRatingStarsProps {
  /** Số sao tô, làm tròn từ 0 tới 5 */
  value: number;
  className?: string;
}

export default function CourseRatingStars({
  value,
  className = "size-3.5",
}: CourseRatingStarsProps) {
  const filledCount = Math.round(value);

  return (
    <span
      className="inline-flex gap-0.5"
      aria-label={`${filledCount} trên 5 sao`}
    >
      {RATING_STAR_POSITIONS.map((position) => (
        <Star
          key={position}
          aria-hidden
          className={cn(
            "shrink-0",
            className,
            position <= filledCount && "fill-amber-500 text-amber-500",
            position > filledCount && "text-foreground/20",
          )}
        />
      ))}
    </span>
  );
}
