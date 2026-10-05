import { formatRating } from "@/modules/course/utils";
import { fetchRatingsPublic } from "@/modules/rating/actions";
import {
  TESTIMONIAL_FETCH_LIMIT,
  TESTIMONIAL_PINNED_COURSE_SLUGS,
  TESTIMONIAL_RATING,
} from "../constants";
import { CatalogStats } from "../types";
import { mergeTestimonials, splitTestimonialRows } from "../utils";
import { SectionHeading } from "./section-heading";
import { TestimonialMarquee } from "./testimonial-marquee";

interface TestimonialsSectionProps {
  stats: CatalogStats;
}

export async function TestimonialsSection({ stats }: TestimonialsSectionProps) {
  const [latestRatings, pinnedRatings] = await Promise.all([
    fetchRatingsPublic({
      page: 1,
      limit: TESTIMONIAL_FETCH_LIMIT,
      rating: TESTIMONIAL_RATING,
    }),
    fetchRatingsPublic({
      page: 1,
      limit: TESTIMONIAL_FETCH_LIMIT,
      rating: TESTIMONIAL_RATING,
      courseSlugs: TESTIMONIAL_PINNED_COURSE_SLUGS,
    }),
  ]);

  const ratings = mergeTestimonials(pinnedRatings || [], latestRatings || []);

  if (ratings.length === 0) return null;

  return (
    <section className="flex min-w-0 flex-col gap-4">
      <SectionHeading
        title="Học viên nói gì"
        subtitle={
          stats.ratingCount > 0
            ? `${formatRating(stats.averageRating)} / 5 trung bình từ ${stats.ratingCount} đánh giá`
            : undefined
        }
      />
      <div className="flex flex-col gap-3">
        {splitTestimonialRows(ratings).map((rowRatings, rowIndex) => (
          <TestimonialMarquee
            key={rowIndex}
            ratings={rowRatings}
            isReversed={rowIndex === 1}
          />
        ))}
      </div>
    </section>
  );
}
