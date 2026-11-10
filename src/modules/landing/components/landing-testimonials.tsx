import { fetchRatingsPublic } from "@/modules/rating/actions";
import { cn } from "@/shared/utils";
import {
  LANDING_SECTION_CLASS_NAME,
  LANDING_SECTION_IDS,
  LANDING_TESTIMONIAL_LIMIT,
  LANDING_TESTIMONIAL_RATING,
} from "../constants";
import { buildTestimonialRows } from "../utils";
import { LandingSectionHeading } from "./landing-section-heading";
import { TestimonialLightfall } from "./testimonial-lightfall";
import { TestimonialMarqueeRow } from "./testimonial-marquee-row";

/**
 * Cảm nhận thật của học viên (đánh giá 5 sao mới nhất): vệt sáng rơi sau tiêu
 * đề, hai hàng card trôi ngang tràn hết bề ngang, mờ hai mép. Đầu đọc màn hình
 * đọc danh sách ẩn bên dưới, không đọc card trôi (có card lặp lại). Chưa có
 * đánh giá nào thì ẩn
 */
export async function LandingTestimonials() {
  const ratings =
    (await fetchRatingsPublic({
      limit: LANDING_TESTIMONIAL_LIMIT,
      page: 1,
      rating: LANDING_TESTIMONIAL_RATING,
    })) || [];

  if (ratings.length === 0) return null;

  return (
    <section
      id={LANDING_SECTION_IDS.testimonials}
      className={cn(
        LANDING_SECTION_CLASS_NAME,
        "relative isolate overflow-hidden",
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[34rem] [mask-image:radial-gradient(ellipse_55%_60%_at_50%_45%,black_20%,transparent_75%)]"
      >
        <TestimonialLightfall />
      </div>
      <div className="px-4 pt-10 sm:px-6 sm:pt-16">
        <LandingSectionHeading
          eyebrow="Cảm nhận"
          title="Học viên nói gì."
          mutedTitle="Đánh giá thật sau khi học."
          isCentered
        />
      </div>
      <div
        aria-hidden="true"
        className="reveal-on-scroll mt-14 flex flex-col gap-4 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] sm:mt-20"
      >
        {buildTestimonialRows(ratings).map((rowRatings, rowIndex) => (
          <TestimonialMarqueeRow
            key={rowIndex}
            ratings={rowRatings}
            isReversed={rowIndex % 2 === 1}
          />
        ))}
      </div>
      <ul className="sr-only">
        {ratings.map((rating) => (
          <li key={rating._id}>
            {rating.user?.name || rating.user?.username || "Học viên"}:{" "}
            {rating.content}
          </li>
        ))}
      </ul>
    </section>
  );
}
