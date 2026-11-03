import Skeleton from "@/shared/components/skeleton";

/** Cùng khung với khối "Tuần này" để lúc dữ liệu về trang không nhảy */
export function WeekLeaderboardStripSkeleton() {
  return (
    <section
      aria-busy="true"
      className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5"
    >
      <Skeleton className="size-10 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3 rounded-full" />
        <Skeleton className="h-3 w-1/2 rounded-full" />
      </div>
      <Skeleton className="hidden h-8 w-28 rounded-full sm:block" />
      <span className="sr-only" role="status">
        Đang tải xếp hạng tuần
      </span>
    </section>
  );
}
