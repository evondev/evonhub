import Skeleton from "@/shared/components/skeleton";
import { VIDEO_RAIL_SKELETON_COUNT } from "../constants";
import { getVideoRailItemClassName } from "../utils";
import { SkeletonBar } from "./skeleton-bar";

/** Cùng khung với khối "Video ngắn": tiêu đề và một hàng thẻ video */
export function VideoRailSkeleton() {
  return (
    <section aria-busy="true" className="flex min-w-0 flex-col gap-4">
      <div className="flex items-end justify-between gap-3">
        <div className="space-y-2">
          <SkeletonBar className="h-5 w-32" />
          <SkeletonBar className="h-3.5 w-56" />
        </div>
        <SkeletonBar className="h-3.5 w-24" />
      </div>
      <ul className="-mx-4 flex gap-3 overflow-hidden px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: VIDEO_RAIL_SKELETON_COUNT }, (_, index) => (
          <li key={index} className={getVideoRailItemClassName(index)}>
            <div className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-surface">
              <Skeleton className="aspect-video w-full rounded-none" />
              <div className="flex flex-col gap-2 p-4 sm:p-5">
                <SkeletonBar className="h-4 w-11/12" />
                <SkeletonBar className="h-4 w-2/3" />
                <SkeletonBar className="mt-3 h-4 w-20" />
              </div>
            </div>
          </li>
        ))}
      </ul>
      <span className="sr-only" role="status">
        Đang tải video
      </span>
    </section>
  );
}
