import Skeleton from "@/shared/components/skeleton";
import { cn } from "@/shared/utils";
import {
  STUDY_SKELETON_CHAPTER_WIDTHS,
  STUDY_SKELETON_LESSON_WIDTHS,
  STUDY_SKELETON_ROW_COUNT,
} from "../constants";

/** Cùng lưới với StudyArea: danh sách khóa bên trái, đề cương bên phải từ lg */
export function StudySkeleton() {
  return (
    <div
      aria-busy="true"
      className="grid gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:items-start xl:grid-cols-[minmax(0,400px)_minmax(0,1fr)]"
    >
      <div className="min-w-0 rounded-2xl border border-border bg-surface p-2">
        <div className="flex h-8 items-center justify-between px-2.5 pb-2 pt-1.5">
          <Skeleton className="h-4 w-36 rounded-full" />
          <Skeleton className="h-3 w-12 rounded-full" />
        </div>
        <div className="flex flex-col gap-0.5">
          {Array.from({ length: STUDY_SKELETON_ROW_COUNT }, (_, index) => (
            <div key={index} className="flex items-center gap-3 p-2.5">
              <Skeleton className="aspect-video w-20 shrink-0 rounded-lg" />
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full rounded-full" />
                  <Skeleton className="h-3 w-3/5 rounded-full" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-2 flex-1 rounded-full" />
                  <Skeleton className="h-3 w-8 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="hidden min-w-0 overflow-hidden rounded-2xl border border-border bg-surface lg:block">
        <div className="flex items-center gap-4 border-b border-border p-5">
          <Skeleton className="hidden aspect-video w-40 shrink-0 rounded-xl xl:block" />
          <div className="min-w-0 flex-1">
            <div className="space-y-2.5">
              <Skeleton className="h-4 w-4/5 rounded-full" />
              <Skeleton className="h-4 w-1/2 rounded-full" />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Skeleton className="h-2 flex-1 rounded-full" />
              <Skeleton className="h-3 w-16 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-10 w-28 shrink-0 rounded-xl" />
        </div>
        {/* Chương đầu mở sẵn như trang thật mở chương có bài tiếp theo */}
        {STUDY_SKELETON_CHAPTER_WIDTHS.map((chapterWidth, chapterIndex) => (
          <div
            key={chapterWidth}
            className="border-t border-border first:border-t-0"
          >
            <div className="flex h-12 items-center gap-2 px-4">
              <Skeleton className="size-4 shrink-0 rounded" />
              <Skeleton className={cn("h-3 rounded-full", chapterWidth)} />
              <Skeleton className="ml-auto h-3 w-8 rounded-full" />
            </div>
            {chapterIndex === 0 && (
              <div className="pb-2">
                {STUDY_SKELETON_LESSON_WIDTHS.map((lessonWidth) => (
                  <div
                    key={lessonWidth}
                    className="mx-2 flex h-10 items-center gap-3 pl-8 pr-2"
                  >
                    <Skeleton className="size-4 shrink-0 rounded-full" />
                    <Skeleton className={cn("h-3 rounded-full", lessonWidth)} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <span className="sr-only" role="status">
        Đang tải
      </span>
    </div>
  );
}
