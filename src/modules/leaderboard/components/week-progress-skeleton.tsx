import Skeleton from "@/shared/components/skeleton";
import { STREAK_DAY_COUNT } from "../constants";

/** Cùng khung với panel "Tuần này" để lúc dữ liệu về trang không nhảy */
export function WeekProgressSkeleton() {
  return (
    <section
      aria-busy="true"
      className="grid min-w-0 grid-cols-1 content-start gap-5 rounded-2xl border border-border bg-surface p-5 md:grid-cols-2 xl:flex xl:flex-col"
    >
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex h-8 items-center justify-between gap-3">
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-3.5 w-24 rounded-full" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="size-12 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-3 w-20 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: STREAK_DAY_COUNT }, (_, index) => (
            <Skeleton key={index} className="mx-auto size-8 rounded-full" />
          ))}
        </div>
      </div>
      <div className="flex min-w-0 flex-col gap-4 border-t border-border pt-5 md:border-l md:border-t-0 md:pl-5 md:pt-0 xl:border-l-0 xl:border-t xl:pl-0 xl:pt-5">
        <Skeleton className="h-11 w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/2 rounded-full" />
          <Skeleton className="h-3.5 w-2/3 rounded-full" />
        </div>
      </div>
      <span className="sr-only" role="status">
        Đang tải chuỗi ngày học và xếp hạng tuần
      </span>
    </section>
  );
}
