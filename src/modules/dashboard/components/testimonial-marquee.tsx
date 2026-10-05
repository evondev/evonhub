import { RatingItemData } from "@/modules/rating/types";
import { cn } from "@/shared/utils";
import { TESTIMONIAL_MARQUEE_MIN_COUNT } from "../constants";
import { TestimonialCard } from "./testimonial-card";

interface TestimonialMarqueeProps {
  ratings: RatingItemData[];
  isReversed: boolean;
}

/**
 * Một dải cảm nhận trôi ngang, rê chuột vào thì dừng để đọc. Bản thứ hai chỉ
 * để nối vòng nên ẩn với trình đọc màn hình; ai tắt chuyển động thì dải đứng
 * yên và cuộn tay được.
 */
export function TestimonialMarquee({
  ratings,
  isReversed,
}: TestimonialMarqueeProps) {
  const isAnimated = ratings.length >= TESTIMONIAL_MARQUEE_MIN_COUNT;

  return (
    <div
      className={cn(
        "group [mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%_-_24px),transparent)] sm:[mask-image:linear-gradient(to_right,transparent,black_64px,black_calc(100%_-_64px),transparent)]",
        isAnimated && "overflow-hidden motion-reduce:overflow-x-auto",
        !isAnimated && "overflow-x-auto",
      )}
    >
      <div
        className={cn(
          "flex w-max",
          isAnimated &&
            "animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none",
          isAnimated && isReversed && "[animation-direction:reverse]",
        )}
      >
        <div className="flex gap-3 pr-3">
          {ratings.map((rating) => (
            <TestimonialCard key={rating._id} rating={rating} />
          ))}
        </div>
        {isAnimated && (
          <div className="flex gap-3 pr-3 motion-reduce:hidden" aria-hidden>
            {ratings.map((rating) => (
              <TestimonialCard key={rating._id} rating={rating} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
