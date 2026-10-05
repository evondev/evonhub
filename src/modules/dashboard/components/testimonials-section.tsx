import { formatRating } from "@/modules/course/utils";
import { fetchRatingsPublic } from "@/modules/rating/actions";
import { RatingStatus } from "@/shared/constants/rating.constants";
import { cn } from "@/shared/utils";
import { TESTIMONIAL_FETCH_LIMIT } from "../constants";
import { CatalogStats } from "../types";
import { pickTestimonials } from "../utils";
import { SectionHeading } from "./section-heading";
import { TestimonialCard } from "./testimonial-card";
import { TestimonialQuoteCard } from "./testimonial-quote-card";

interface TestimonialsSectionProps {
  stats: CatalogStats;
}

export async function TestimonialsSection({ stats }: TestimonialsSectionProps) {
  const ratings = await fetchRatingsPublic({
    page: 1,
    limit: TESTIMONIAL_FETCH_LIMIT,
    status: RatingStatus.Active,
  });

  const { featuredRating, otherRatings } = pickTestimonials(ratings || []);

  if (!featuredRating) return null;

  return (
    <section className="flex flex-col gap-4">
      <SectionHeading
        title="Học viên nói gì"
        subtitle={
          stats.ratingCount > 0
            ? `${formatRating(stats.averageRating)} / 5 trung bình từ ${stats.ratingCount} đánh giá`
            : undefined
        }
      />
      <div
        className={cn(
          "grid gap-3",
          otherRatings.length > 0 &&
            "lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]",
        )}
      >
        <TestimonialQuoteCard rating={featuredRating} />
        {otherRatings.length > 0 && (
          <div className="grid min-w-0 gap-3">
            {otherRatings.map((rating) => (
              <TestimonialCard key={rating._id} rating={rating} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
