import Skeleton from "@/shared/components/skeleton";
import { STREAK_DAY_COUNT } from "../constants";

/** Cùng khung với thẻ chuỗi ngày học để lúc dữ liệu về trang không nhảy */
export function StudyStreakCardSkeleton() {
  return (
    <section
      aria-busy="true"
      className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-5 lg:flex-row lg:items-center lg:gap-8"
    >
      <div className="flex items-center gap-3 lg:w-52 lg:shrink-0">
        <Skeleton className="size-12 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-3 w-20 rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 lg:w-72 lg:shrink-0">
        {Array.from({ length: STREAK_DAY_COUNT }, (_, index) => (
          <Skeleton key={index} className="mx-auto size-8 rounded-full" />
        ))}
      </div>
      <Skeleton className="h-11 rounded-xl lg:flex-1" />
      <span className="sr-only" role="status">
        Đang tải chuỗi ngày học
      </span>
    </section>
  );
}
