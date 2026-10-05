import Skeleton from "@/shared/components/skeleton";
import { EXPLORE_PAGE_SIZE } from "../../../constants";

/** Khung chờ phần kết quả; thanh lọc nằm ngoài nên không nhấp nháy */
export function ExploreSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-4 sm:gap-5">
      <div className="flex min-h-9 items-center justify-between gap-3">
        <Skeleton className="h-4 w-24 rounded-full" />
        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>
      {/* Đủ một trang kết quả, hàng cuối không lẻ ở lưới nào */}
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4 2xl:gap-6">
        {Array.from({ length: EXPLORE_PAGE_SIZE }, (_, index) => (
          <div
            key={index}
            className="flex min-w-0 overflow-hidden rounded-2xl border border-border bg-surface sm:flex-col"
          >
            <Skeleton className="m-3 aspect-video w-32 shrink-0 self-start rounded-lg sm:m-0 sm:w-full sm:rounded-none" />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5 py-3 pr-3 sm:gap-2 sm:p-5">
              <div className="space-y-2.5 py-1">
                <Skeleton className="h-4 w-11/12 rounded-full" />
                <Skeleton className="h-4 w-3/5 rounded-full" />
              </div>
              <Skeleton className="h-3 w-1/2 rounded-full" />
              <div className="mt-auto flex items-center justify-between gap-2 pt-2.5 sm:pt-3">
                <Skeleton className="h-4 w-20 rounded-full" />
                <Skeleton className="h-3 w-12 rounded-full" />
              </div>
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
