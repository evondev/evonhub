import Skeleton from "@/shared/components/skeleton";
import {
  SKELETON_CHART_BAR_HEIGHTS,
  SKELETON_COURSE_ROW_WIDTHS,
  SKELETON_STAT_TILE_COUNT,
} from "../constants";
import { SkeletonBar } from "./skeleton-bar";

export function LearnerOverviewSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-4">
      <section className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5">
        <Skeleton className="hidden aspect-video w-60 shrink-0 rounded-xl sm:block" />
        <div className="flex-1 space-y-3">
          <SkeletonBar className="w-1/3" />
          <SkeletonBar className="h-5 w-2/3" />
          <SkeletonBar className="h-2 w-full" />
          <SkeletonBar className="w-1/4" />
        </div>
      </section>
      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
        {Array.from({ length: SKELETON_STAT_TILE_COUNT }, (_, index) => (
          <div key={index} className="space-y-3 bg-surface p-4 sm:p-5">
            <SkeletonBar className="w-2/3" />
            <SkeletonBar className="h-6 w-1/3" />
            <SkeletonBar className="w-1/2" />
          </div>
        ))}
      </section>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-border bg-surface p-4 sm:p-5 lg:col-span-2">
          <SkeletonBar className="mb-4 h-4 w-32" />
          {SKELETON_COURSE_ROW_WIDTHS.map((widthClassName) => (
            <div
              key={widthClassName}
              className="flex items-center gap-3 py-2.5"
            >
              <Skeleton className="size-12 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <SkeletonBar className={widthClassName} />
                <SkeletonBar className="h-1.5 w-full" />
                <SkeletonBar className="w-1/4" />
              </div>
            </div>
          ))}
        </section>
        <section className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
          <SkeletonBar className="mb-4 h-4 w-40" />
          <div className="flex h-44 items-end gap-2">
            {SKELETON_CHART_BAR_HEIGHTS.map((barHeight, index) => (
              <div
                key={index}
                className="mx-auto w-full max-w-8"
                style={{ height: `${barHeight}%` }}
              >
                <Skeleton className="size-full rounded-t-md" />
              </div>
            ))}
          </div>
        </section>
      </div>
      <span className="sr-only" role="status">
        Đang tải tiến độ học
      </span>
    </div>
  );
}
