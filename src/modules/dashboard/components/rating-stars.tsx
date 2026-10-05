import { cn } from "@/shared/utils";
import { Star } from "lucide-react";
import { STAR_POSITIONS } from "../constants";

interface RatingStarsProps {
  rating: number;
}

export function RatingStars({ rating }: RatingStarsProps) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} trên 5 sao`}>
      {STAR_POSITIONS.map((position) => (
        <Star
          key={position}
          className={cn(
            "size-4",
            position <= rating && "fill-amber-500 text-amber-500",
            position > rating && "text-foreground/20",
          )}
        />
      ))}
    </div>
  );
}
