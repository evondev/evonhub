import Skeleton from "@/shared/components/skeleton";
import { SKELETON_ROADMAP_STEP_COUNT } from "../constants";
import { SkeletonBar } from "./skeleton-bar";

export function DashboardSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-8 sm:gap-10">
      <Skeleton className="h-72 rounded-2xl" />
      <section className="flex flex-col gap-4">
        <SkeletonBar className="h-6 w-44" />
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: SKELETON_ROADMAP_STEP_COUNT }, (_, index) => (
            <div key={index} className="flex gap-4 md:flex-col">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="flex-1 space-y-3 rounded-2xl border border-border bg-surface p-5">
                <Skeleton className="size-10 rounded-xl" />
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
