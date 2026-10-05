import {
  COURSE_DETAILS_SKELETON_CHAPTER_WIDTHS,
  COURSE_DETAILS_SKELETON_INCLUDE_WIDTHS,
  COURSE_DETAILS_SKELETON_OUTCOME_WIDTHS,
} from "@/modules/course/constants";
import Skeleton from "@/shared/components/skeleton";
import { cn } from "@/shared/utils";

export interface CourseDetailsLoadingProps {}

/**
 * Khung chờ cùng lưới với CourseDetailsView: từ xl đầu trang và nội dung bên
 * trái, thẻ mua bên phải; màn hẹp một cột đầu trang → thẻ mua → nội dung.
 */
export function CourseDetailsLoading(_props: CourseDetailsLoadingProps) {
  return (
    <div aria-busy="true" className="pb-4 lg:pb-0">
      <div className="grid grid-cols-1 gap-6 [grid-template-areas:'head'_'card'_'body'] xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-x-8 xl:[grid-template-areas:'head_card'_'body_card']">
        <div className="min-w-0 [grid-area:head]">
          <div className="flex h-8 items-center">
            <Skeleton className="h-3 w-36 rounded-full" />
          </div>
          {/* Tên khóa thường dài, text-balance chia hai dòng */}
          <div className="mt-1 space-y-3">
            <Skeleton className="h-6 w-4/5 rounded-full sm:h-7 sm:w-1/2" />
            <Skeleton className="h-6 w-1/2 rounded-full sm:h-7 sm:w-2/5" />
          </div>
          <Skeleton className="mt-4 h-3.5 w-80 max-w-full rounded-full" />
        </div>

        <div className="self-start overflow-hidden rounded-2xl border border-border bg-surface [grid-area:card]">
          <Skeleton className="aspect-video w-full" />
          <div className="flex flex-col gap-4 p-4 sm:p-5">
            <Skeleton className="h-8 w-2/5 rounded-full" />
            <Skeleton className="h-11 w-full rounded-xl" />
            <div className="space-y-3 border-t border-border pt-4">
              <Skeleton className="h-3 w-24 rounded-full" />
              {COURSE_DETAILS_SKELETON_INCLUDE_WIDTHS.map((includeWidth) => (
                <div key={includeWidth} className="flex items-center gap-2.5">
                  <Skeleton className="size-4 shrink-0 rounded" />
                  <Skeleton className={cn("h-3 rounded-full", includeWidth)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-8 [grid-area:body]">
          <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
            <Skeleton className="mb-4 mt-1 h-4 w-32 rounded-full" />
            <div className="flex flex-col gap-2.5">
              {COURSE_DETAILS_SKELETON_OUTCOME_WIDTHS.map((outcomeWidth) => (
                <div key={outcomeWidth} className="flex h-6 items-center gap-2.5">
                  <Skeleton className="size-4 shrink-0 rounded" />
                  <Skeleton className={cn("h-3 rounded-full", outcomeWidth)} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-end justify-between gap-3">
              <div className="space-y-3">
                <Skeleton className="h-5 w-44 rounded-full" />
                <Skeleton className="h-3.5 w-40 rounded-full" />
              </div>
              <Skeleton className="h-3 w-16 rounded-full" />
            </div>
            <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
              {COURSE_DETAILS_SKELETON_CHAPTER_WIDTHS.map((chapterWidth) => (
                <div
                  key={chapterWidth}
                  className="flex items-center gap-4 px-4 py-5 sm:px-5"
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <Skeleton className={cn("h-3 rounded-full", chapterWidth)} />
                    <Skeleton className="h-3 w-28 shrink-0 rounded-full" />
                  </div>
                  <Skeleton className="size-4 shrink-0 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <span className="sr-only" role="status">
        Đang tải khóa học
      </span>
    </div>
  );
}
