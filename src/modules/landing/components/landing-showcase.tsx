import { CatalogStats } from "@/modules/course/types";
import { cn } from "@/shared/utils";
import Image from "next/image";
import {
  LANDING_CONTAINER_CLASS_NAME,
  LANDING_SECTION_CLASS_NAME,
  LESSON_SHOWCASE_IMAGE,
} from "../constants";
import { ShowcaseRatingChip } from "./showcase-rating-chip";
import { LandingGlow } from "./landing-glow";
import { LandingSectionHeading } from "./landing-section-heading";
import { NeonEdge } from "./neon-edge";

interface LandingShowcaseProps {
  stats: CatalogStats;
}

/**
 * Ảnh chụp trang học thật trong khung kính có viền sáng chạy, quầng tím phía
 * sau; điểm đánh giá nổi ở góc (từ lg)
 */
export function LandingShowcase({ stats }: LandingShowcaseProps) {
  return (
    <section
      className={cn(LANDING_SECTION_CLASS_NAME, LANDING_CONTAINER_CLASS_NAME)}
    >
      <LandingSectionHeading
        eyebrow="Trang học"
        title="Mở bài là vào học."
        mutedTitle="Mọi thứ nằm gọn một màn."
        isCentered
      />
      <div className="reveal-on-scroll relative isolate mx-auto mt-12 max-w-5xl sm:mt-16">
        <LandingGlow className="-inset-x-24 -top-20 bottom-10" />
        <div className="border-beam relative rounded-3xl bg-white/[0.03] p-2 ring-1 ring-inset ring-white/10 backdrop-blur-sm">
          <NeonEdge />
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl ring-1 ring-white/10 [mask-image:linear-gradient(to_bottom,black_75%,transparent)]">
            <Image
              src={LESSON_SHOWCASE_IMAGE.src}
              alt="Trang học bài trên EvonHub: video bài học và nút chuyển bài"
              width={LESSON_SHOWCASE_IMAGE.width}
              height={LESSON_SHOWCASE_IMAGE.height}
              sizes="(min-width: 1024px) 1008px, 100vw"
              className="w-full object-cover object-top"
            />
          </div>
        </div>
        {stats.ratingCount > 0 && (
          <div className="absolute -right-8 top-16 hidden lg:block">
            <ShowcaseRatingChip
              averageRating={stats.averageRating}
              ratingCount={stats.ratingCount}
            />
          </div>
        )}
      </div>
    </section>
  );
}
