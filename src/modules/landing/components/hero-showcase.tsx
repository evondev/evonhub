import { CatalogStats } from "@/modules/course/types";
import Image from "next/image";
import { HERO_SHOWCASE_IMAGE } from "../constants";
import { HeroCodePreview } from "./hero-code-preview";
import { HeroRatingChip } from "./hero-rating-chip";
import { LandingGlow } from "./landing-glow";

interface HeroShowcaseProps {
  stats: CatalogStats;
}

/**
 * Ảnh chụp trang học thật trong khung, khung code lỗi và điểm đánh giá nổi
 * chồng lên hai góc (từ lg). Ảnh có bản sáng và tối theo giao diện
 */
export function HeroShowcase({ stats }: HeroShowcaseProps) {
  return (
    <div className="relative mx-auto mt-14 max-w-5xl motion-safe:animate-hero-rise motion-safe:[animation-delay:500ms] sm:mt-20">
      <LandingGlow className="-inset-x-24 -top-16 bottom-0" />
      <div className="rounded-3xl border border-border-strong bg-surface/60 p-2 backdrop-blur-sm">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border [mask-image:linear-gradient(to_bottom,black_75%,transparent)]">
          <Image
            src={HERO_SHOWCASE_IMAGE.light}
            alt="Trang học bài trên EvonHub: video bài học và nút chuyển bài"
            width={HERO_SHOWCASE_IMAGE.width}
            height={HERO_SHOWCASE_IMAGE.height}
            priority
            sizes="(min-width: 1024px) 1008px, 100vw"
            className="w-full object-cover object-top dark:hidden"
          />
          <Image
            src={HERO_SHOWCASE_IMAGE.dark}
            alt="Trang học bài trên EvonHub: video bài học và nút chuyển bài"
            width={HERO_SHOWCASE_IMAGE.width}
            height={HERO_SHOWCASE_IMAGE.height}
            sizes="(min-width: 1024px) 1008px, 100vw"
            className="hidden w-full object-cover object-top dark:block"
          />
        </div>
      </div>
      <div className="absolute -bottom-8 -left-10 hidden w-[30rem] lg:block">
        <HeroCodePreview />
      </div>
      {stats.ratingCount > 0 && (
        <div className="absolute -right-8 top-16 hidden motion-safe:animate-hero-rise motion-safe:[animation-delay:1200ms] lg:block">
          <HeroRatingChip
            averageRating={stats.averageRating}
            ratingCount={stats.ratingCount}
          />
        </div>
      )}
    </div>
  );
}
