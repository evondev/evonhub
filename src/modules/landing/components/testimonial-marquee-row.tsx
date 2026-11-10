import { RatingItemData } from "@/modules/rating/types";
import { cn } from "@/shared/utils";
import { LandingTestimonialCard } from "./landing-testimonial-card";

interface TestimonialMarqueeRowProps {
  ratings: RatingItemData[];
  /** Hàng thứ hai trôi ngược chiều hàng đầu */
  isReversed?: boolean;
}

// Hai bản giống nhau nối đuôi: trôi hết một bản là quay về đầu, không giật
const MARQUEE_COPY_INDEXES: number[] = [0, 1];

/**
 * Một hàng card trôi ngang, rê chuột vào thì dừng để đọc. Máy bật giảm chuyển
 * động thì đứng yên, kéo ngang để xem
 */
export function TestimonialMarqueeRow({
  ratings,
  isReversed = false,
}: TestimonialMarqueeRowProps) {
  return (
    <div className="group overflow-hidden motion-reduce:overflow-x-auto">
      <div
        className={cn(
          "flex w-max animate-marquee [animation-duration:80s] group-hover:[animation-play-state:paused] motion-reduce:animate-none",
          isReversed && "[animation-direction:reverse]",
        )}
      >
        {MARQUEE_COPY_INDEXES.map((copyIndex) => (
          <div
            key={copyIndex}
            className="flex shrink-0 items-stretch gap-4 pr-4"
          >
            {ratings.map((rating, ratingIndex) => (
              <LandingTestimonialCard
                key={`${rating._id}-${ratingIndex}`}
                rating={rating}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
