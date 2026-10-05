import Skeleton from "@/shared/components/skeleton";
import { MY_ORDERS_SKELETON_ROW_COUNT } from "../../../constants";

/** Khung chờ đúng hình hai khối: một đơn chờ thanh toán và vài dòng lịch sử */
export function MyOrdersSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-4 sm:gap-6">
      <div className="rounded-2xl border border-border bg-surface">
        <div className="space-y-2 px-4 pt-4 sm:px-5 sm:pt-5">
          <Skeleton className="h-4 w-32 rounded-full" />
          <Skeleton className="h-3 w-2/3 max-w-md rounded-full" />
        </div>
        <div className="flex items-center gap-3 p-4 sm:gap-4 sm:px-5">
          <Skeleton className="aspect-video w-24 shrink-0 rounded-lg sm:w-28" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4 max-w-sm rounded-full" />
            <Skeleton className="h-3 w-1/2 max-w-48 rounded-full" />
          </div>
          <Skeleton className="hidden h-10 w-28 rounded-xl sm:block" />
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-2 sm:p-3">
        <div className="flex min-h-11 items-center px-2 sm:px-3">
          <Skeleton className="h-4 w-36 rounded-full" />
        </div>
        {Array.from({ length: MY_ORDERS_SKELETON_ROW_COUNT }, (_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-2 sm:gap-4 sm:px-3"
          >
            <Skeleton className="aspect-video w-20 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3 max-w-sm rounded-full" />
              <Skeleton className="h-3 w-1/3 max-w-40 rounded-full" />
            </div>
            <Skeleton className="hidden h-6 w-28 rounded-full sm:block" />
          </div>
        ))}
      </div>
      <span className="sr-only" role="status">
        Đang tải
      </span>
    </div>
  );
}
