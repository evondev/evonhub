import Skeleton from "@/shared/components/skeleton";
import { cn } from "@/shared/utils";
import { SkeletonBar } from "./skeleton-bar";

interface RoadmapSkeletonProps {
  stepCount: number;
}

/** Cùng lưới với RoadmapSection; chỉ hiện khi lộ trình có đủ bước */
export function RoadmapSkeleton({ stepCount }: RoadmapSkeletonProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="space-y-2">
        <SkeletonBar className="h-5 w-40" />
        <SkeletonBar className="w-72 max-w-full" />
      </div>
      <div
        className={cn(
          "grid gap-6",
          stepCount === 2 && "md:grid-cols-2",
          stepCount === 3 && "md:grid-cols-3",
          stepCount >= 4 && "md:grid-cols-2 xl:grid-cols-4",
        )}
      >
        {Array.from({ length: stepCount }, (_, index) => (
          <div key={index} className="flex gap-4 md:flex-col">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="flex flex-1 gap-3 rounded-2xl border border-border bg-surface p-5">
              <Skeleton className="size-10 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2.5">
                <SkeletonBar className="h-4 w-2/3" />
                <SkeletonBar className="w-5/6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
