import Skeleton from "@/shared/components/skeleton";
import { COURSE_ACCESS_SKELETON_ROW_COUNT } from "../../../constants/course-access.constants";

/** Khung chờ đúng hình trang: đầu trang có avatar, rồi khối khóa đang có */
export function CourseAccessSkeleton() {
  return (
    <div
      aria-busy="true"
      className="mx-auto flex w-full max-w-4xl flex-col gap-4 sm:gap-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex h-8 items-center">
            <Skeleton className="h-3.5 w-32 rounded-full" />
          </div>
          <div className="mt-1 flex items-center gap-3">
            <Skeleton className="size-12 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-40 rounded-full" />
              <Skeleton className="h-3.5 w-2/3 max-w-sm rounded-full" />
            </div>
          </div>
        </div>
        <Skeleton className="h-11 w-36 rounded-xl md:h-10" />
      </div>
      <div className="rounded-2xl border border-border bg-surface p-2 sm:p-3">
        <div className="flex min-h-11 items-center px-2 sm:px-3">
          <Skeleton className="h-4 w-36 rounded-full" />
        </div>
        {Array.from({ length: COURSE_ACCESS_SKELETON_ROW_COUNT }, (_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-2 sm:gap-4 sm:px-3"
          >
            <Skeleton className="aspect-video w-20 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3 max-w-sm rounded-full" />
              <Skeleton className="h-3 w-1/3 max-w-40 rounded-full" />
            </div>
            <Skeleton className="size-11 shrink-0 rounded-xl sm:h-10 sm:w-24" />
          </div>
        ))}
      </div>
      <span className="sr-only" role="status">
        Đang tải
      </span>
    </div>
  );
}
