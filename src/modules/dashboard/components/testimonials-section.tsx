import { formatRating } from "@/modules/course/utils";
import { fetchRatingsPublic } from "@/modules/rating/actions";
import { RatingStatus } from "@/shared/constants/rating.constants";
import { TESTIMONIAL_LIMIT } from "../constants";
import { CatalogStats } from "../types";
import { SectionHeading } from "./section-heading";
import { TestimonialCard } from "./testimonial-card";

interface TestimonialsSectionProps {
  stats: CatalogStats;
}

export async function TestimonialsSection({ stats }: TestimonialsSectionProps) {
  const ratings = await fetchRatingsPublic({
    page: 1,
    limit: TESTIMONIAL_LIMIT,
    status: RatingStatus.Active,
  });

  if (!ratings || ratings.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <SectionHeading
        title="Học viên nói gì"
        subtitle={
          stats.ratingCount > 0
            ? `${formatRating(stats.averageRating)} / 5 trung bình từ ${stats.ratingCount} đánh giá`
            : undefined
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {ratings.map((rating) => (
          <TestimonialCard key={rating._id} rating={rating} />
        ))}
      </div>
    </section>
  );
}
