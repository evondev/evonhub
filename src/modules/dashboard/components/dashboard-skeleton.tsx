import Skeleton from "@/shared/components/skeleton";
import { SKELETON_ROADMAP_STEP_COUNT } from "../constants";
import { SkeletonBar } from "./skeleton-bar";

export function DashboardSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-4">
      <Skeleton className="h-56 rounded-2xl" />
      <section className="mt-4 flex flex-col gap-3">
        <SkeletonBar className="h-5 w-48" />
        <div className="grid gap-3 sm:grid-cols-3">
          {Array.from({ length: SKELETON_ROADMAP_STEP_COUNT }, (_, index) => (
            <div
              key={index}
              className="flex gap-3 rounded-2xl border border-border bg-surface p-3 sm:flex-col sm:p-4"
            >
              <Skeleton className="aspect-video w-28 shrink-0 rounded-xl sm:w-full" />
              <div className="flex-1 space-y-3 sm:mt-3">
                <SkeletonBar className="h-4 w-2/3" />
                <SkeletonBar className="w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </section>
      <span className="sr-only" role="status">
        Đang tải
      </span>
    </div>
  );
}
