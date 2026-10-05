import Skeleton from "@/shared/components/skeleton";
import { STUDY_SKELETON_ROW_COUNT } from "../constants";

export function StudySkeleton() {
  return (
    <div
      aria-busy="true"
      className="grid gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:items-start xl:grid-cols-[minmax(0,400px)_minmax(0,1fr)]"
    >
      <div className="flex flex-col gap-0.5 rounded-2xl border border-border bg-surface p-2">
        <Skeleton className="mx-2.5 mb-2 mt-1.5 h-5 w-36 rounded-full" />
        {Array.from({ length: STUDY_SKELETON_ROW_COUNT }, (_, index) => (
          <div key={index} className="flex items-center gap-3 p-2.5">
            <Skeleton className="aspect-video w-20 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-full rounded-full" />
              <Skeleton className="h-2 w-2/3 rounded-full" />
            </div>
          </div>
        ))}
      </div>
      <div className="hidden h-96 rounded-2xl border border-border bg-surface lg:block">
        <div className="flex items-center gap-4 border-b border-border p-5">
          <Skeleton className="hidden aspect-video w-40 shrink-0 rounded-xl xl:block" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-2/3 rounded-full" />
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        </div>
      </div>
      <span className="sr-only" role="status">
        Đang tải
      </span>
    </div>
  );
}
