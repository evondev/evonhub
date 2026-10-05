import { BandSkeletonBar } from "./band-skeleton-bar";

/** Cùng khung với LearnerHero: lời chào, tên khóa, nút Học tiếp, ô tiến độ */
export function LearnerHeroSkeleton() {
  return (
    <section className="grid gap-6 rounded-2xl bg-brand-band bg-gradient-to-br from-brand-band to-brand-band-end p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:items-center">
      <div className="min-w-0">
        <BandSkeletonBar className="h-3.5 w-36" />
        <div className="mt-3 space-y-3">
          <BandSkeletonBar className="h-6 w-4/5 sm:h-7" />
          <BandSkeletonBar className="h-6 w-1/2 sm:h-7" />
        </div>
        <BandSkeletonBar className="mt-4 h-3.5 w-48" />
        <BandSkeletonBar className="mt-5 h-10 w-28 rounded-xl" />
      </div>
      <div className="min-w-0 rounded-xl bg-black/15 p-4 ring-1 ring-white/15">
        <div className="flex items-center justify-between">
          <BandSkeletonBar className="h-3.5 w-14" />
          <BandSkeletonBar className="h-3.5 w-20" />
        </div>
        <BandSkeletonBar className="mt-3 h-2 w-full" />
      </div>
    </section>
  );
}
