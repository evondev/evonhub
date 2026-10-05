import Skeleton from "@/shared/components/skeleton";
import { IN_PROGRESS_SKELETON_ROW_COUNT } from "../constants";
import { SkeletonBar } from "./skeleton-bar";

/** Cùng khung với CourseProgressCard: tiêu đề, link và các dòng tiến độ */
export function CourseProgressCardSkeleton() {
  return (
    <section className="flex min-w-0 flex-col rounded-2xl border border-border bg-surface py-4 sm:py-5">
      <div className="flex items-start justify-between gap-3 px-4 sm:px-5">
        <div className="flex min-h-10 items-center">
          <SkeletonBar className="h-4 w-28" />
        </div>
        <div className="my-1 flex h-8 items-center">
          <SkeletonBar className="h-3.5 w-28" />
        </div>
      </div>
      <ul className="flex flex-col gap-0.5 px-1 sm:px-2">
        {Array.from({ length: IN_PROGRESS_SKELETON_ROW_COUNT }, (_, index) => (
          <li key={index} className="flex items-center gap-3 px-3 py-2.5">
            <Skeleton className="size-12 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1">
              <div className="flex h-5 items-center justify-between gap-3">
                <SkeletonBar className="h-3.5 w-3/5" />
                <SkeletonBar className="h-3.5 w-8" />
              </div>
              <SkeletonBar className="mt-2 h-1.5 w-full" />
              <div className="mt-1.5 flex h-4 items-center">
                <SkeletonBar className="w-28" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
