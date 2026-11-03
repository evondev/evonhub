import Skeleton from "@/shared/components/skeleton";
import { SkeletonBar } from "./skeleton-bar";

/** Cùng khung với LearnerHero: ảnh bìa, lời chào, tên khóa, tiến độ, bài tiếp theo */
export function LearnerHeroSkeleton() {
  return (
    <section className="grid min-w-0 grid-cols-1 overflow-hidden rounded-2xl border border-border bg-surface min-[1360px]:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <Skeleton className="aspect-[5/2] max-h-56 w-full rounded-none min-[1360px]:aspect-auto min-[1360px]:h-full min-[1360px]:max-h-none" />
      <div className="flex min-w-0 flex-col justify-between gap-6 p-5 sm:p-8 min-[1360px]:p-6 2xl:p-8">
        <div className="min-w-0">
          <SkeletonBar className="h-3.5 w-36" />
          <div className="mt-3 space-y-3">
            <SkeletonBar className="h-6 w-4/5 sm:h-7" />
            <SkeletonBar className="h-6 w-1/2 sm:h-7" />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <SkeletonBar className="h-2 flex-1" />
            <SkeletonBar className="h-3.5 w-16" />
          </div>
          <SkeletonBar className="mt-3 h-3.5 w-48" />
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-item-hover p-4">
          <div className="min-w-0 flex-1 space-y-2">
            <SkeletonBar className="w-24" />
            <SkeletonBar className="h-3.5 w-3/5" />
          </div>
          <Skeleton className="h-10 w-28 shrink-0 rounded-xl" />
        </div>
      </div>
    </section>
  );
}
