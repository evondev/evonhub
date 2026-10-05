import Skeleton from "@/shared/components/skeleton";
import { EXPLORE_SKELETON_CARD_COUNT } from "../../../constants";

/** Khung chờ phần kết quả; thanh lọc nằm ngoài nên không nhấp nháy */
export function ExploreSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-4">
      <div className="flex min-h-9 items-center">
        <Skeleton className="h-4 w-24 rounded-full" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: EXPLORE_SKELETON_CARD_COUNT }, (_, index) => (
          <div
            key={index}
            className="flex overflow-hidden rounded-2xl border border-border bg-surface sm:flex-col"
          >
            <Skeleton className="m-3 aspect-video w-32 shrink-0 rounded-lg sm:m-0 sm:w-full sm:rounded-none" />
            <div className="flex-1 space-y-3 py-3 pr-3 sm:p-4">
              <Skeleton className="h-4 w-5/6 rounded-full" />
              <Skeleton className="h-3 w-1/2 rounded-full" />
              <Skeleton className="h-4 w-1/3 rounded-full" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only" role="status">
        Đang tải
      </span>
    </div>
  );
}
