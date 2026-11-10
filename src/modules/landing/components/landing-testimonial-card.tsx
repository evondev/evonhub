import { RatingItemData } from "@/modules/rating/types";
import { UserAvatar } from "@/shared/components/common/user-avatar";

interface LandingTestimonialCardProps {
  rating: RatingItemData;
}

/** Một đánh giá thật của học viên trong hàng trôi ngang: người viết trên, lời dưới */
export function LandingTestimonialCard({
  rating,
}: LandingTestimonialCardProps) {
  const authorName = rating.user?.name || rating.user?.username || "Học viên";
  const courseTitle = rating.course?.title;

  return (
    <figure className="flex w-[19rem] shrink-0 flex-col gap-5 rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6 ring-1 ring-inset ring-white/10 transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgb(167_139_250/0.35),0_16px_50px_-20px_rgb(139_92_246/0.7)] sm:w-[24rem] sm:p-7">
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
      <blockquote className="line-clamp-4 text-pretty text-sm leading-6 text-foreground/80">
        {rating.content}
      </blockquote>
    </figure>
  );
}
