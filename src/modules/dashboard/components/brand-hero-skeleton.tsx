import { HERO_STAT_SKELETON_COUNT } from "../constants";
import { BandSkeletonBar } from "./band-skeleton-bar";
import { HeroCodeCard } from "./hero-code-card";

/**
 * Cùng khung với BrandHero của khách: tiêu đề, đoạn giới thiệu, nút, hàng số
 * liệu. Đoạn code bên phải là nội dung cố định nên hiện luôn bản thật.
 */
export function BrandHeroSkeleton() {
  return (
    <section className="grid gap-8 rounded-2xl bg-brand-band bg-gradient-to-br from-brand-band to-brand-band-end p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-center">
      <div className="flex min-w-0 flex-col gap-6">
        <div>
          <div className="space-y-3">
            <BandSkeletonBar className="h-7 w-4/5 sm:h-8" />
            <BandSkeletonBar className="h-7 w-3/5 sm:h-8" />
          </div>
          <div className="mt-5 space-y-2">
            <BandSkeletonBar className="h-3.5 w-full max-w-md" />
            <BandSkeletonBar className="h-3.5 w-2/3 max-w-xs" />
          </div>
          <BandSkeletonBar className="mt-6 h-10 w-40 rounded-xl" />
        </div>
        <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-4">
          {Array.from({ length: HERO_STAT_SKELETON_COUNT }, (_, index) => (
            <div key={index} className="min-w-0 space-y-2">
              <BandSkeletonBar className="h-5 w-16 max-w-full" />
              <BandSkeletonBar className="w-20 max-w-full" />
            </div>
          ))}
        </div>
      </div>
      <HeroCodeCard />
    </section>
  );
}
