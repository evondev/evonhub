import { fetchRatingsPublic } from "@/modules/rating/actions";
import { cn } from "@/shared/utils";
import {
  LANDING_CONTAINER_CLASS_NAME,
  LANDING_SECTION_CLASS_NAME,
  LANDING_SECTION_IDS,
  LANDING_TESTIMONIAL_LIMIT,
  LANDING_TESTIMONIAL_RATING,
} from "../constants";
import { LandingSectionHeading } from "./landing-section-heading";
import { LandingTestimonialCard } from "./landing-testimonial-card";

/** Cảm nhận thật của học viên (đánh giá 5 sao mới nhất); chưa có thì ẩn */
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
      className={cn(LANDING_SECTION_CLASS_NAME, LANDING_CONTAINER_CLASS_NAME)}
    >
      <LandingSectionHeading
        eyebrow="Cảm nhận"
        title="Học viên nói gì."
        mutedTitle="Đánh giá thật sau khi học."
        isCentered
      />
      <div className="mt-12 columns-1 gap-4 sm:mt-16 sm:columns-2 lg:columns-3">
        {ratings.map((rating) => (
          <LandingTestimonialCard key={rating._id} rating={rating} />
        ))}
      </div>
    </section>
  );
}
