import Skeleton from "@/shared/components/skeleton";
import { VIDEO_LIST_SKELETON_COUNT } from "../../../constants/video-list.constants";

/** Khung chờ phần kết quả, cùng hình thẻ video; thanh lọc nằm ngoài nên không nhấp nháy */
export function VideoListSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-4 sm:gap-5">
      <Skeleton className="h-5 w-36 rounded-full" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4 2xl:gap-6">
        {Array.from({ length: VIDEO_LIST_SKELETON_COUNT }, (_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-border bg-surface"
          >
            <Skeleton className="aspect-video w-full rounded-none" />
            <div className="flex flex-col gap-2 p-4 sm:p-5">
              <Skeleton className="h-4 w-11/12 rounded-full" />
              <Skeleton className="h-4 w-2/3 rounded-full" />
              <Skeleton className="mt-1 h-3 w-1/3 rounded-full" />
              <Skeleton className="mt-3 h-4 w-20 rounded-full" />
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
