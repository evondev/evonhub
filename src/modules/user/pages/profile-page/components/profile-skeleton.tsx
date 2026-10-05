import Skeleton from "@/shared/components/skeleton";
import { cn } from "@/shared/utils";
import {
  PROFILE_ROW_CLASS_NAME,
  PROFILE_SKELETON_FIELD_COUNT,
} from "../../../constants";

/** Khung chờ đúng hình khối đầu: đầu trang, hàng ảnh, ba hàng ô nhập */
export function ProfileSkeleton() {
  return (
    <div
      aria-busy="true"
      className="mx-auto flex w-full max-w-3xl flex-col gap-4 sm:gap-6"
    >
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-11 w-48 rounded-xl md:h-10" />
      </div>
      <div className="rounded-2xl border border-border bg-surface">
        <div className="space-y-2 px-4 pt-4 sm:px-5 sm:pt-5">
          <Skeleton className="h-4 w-36 rounded-full" />
          <Skeleton className="h-3 w-2/3 max-w-sm rounded-full" />
        </div>
        <div className="mt-2 divide-y divide-border">
          <div className={cn(PROFILE_ROW_CLASS_NAME, "sm:items-center")}>
            <Skeleton className="h-4 w-24 rounded-full" />
            <div className="flex items-center gap-4">
              <Skeleton className="size-16 shrink-0 rounded-full" />
              <Skeleton className="h-11 w-24 rounded-xl md:h-10" />
            </div>
          </div>
          {Array.from({ length: PROFILE_SKELETON_FIELD_COUNT }, (_, index) => (
            <div key={index} className={PROFILE_ROW_CLASS_NAME}>
              <div className="flex items-center sm:min-h-11 md:min-h-10">
                <Skeleton className="h-4 w-20 rounded-full" />
              </div>
              <Skeleton className="h-11 w-full rounded-xl md:h-10" />
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only" role="status">
        Đang tải
      </span>
    </div>
  );
}
