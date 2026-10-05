import Skeleton from "@/shared/components/skeleton";

export interface CourseDetailsLoadingProps {}

/** Khung chờ đúng hình trang: đầu trang + các khối bên trái, thẻ mua bên phải */
export function CourseDetailsLoading(_props: CourseDetailsLoadingProps) {
  return (
    <div
      aria-busy="true"
      className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-x-8"
    >
      <span className="sr-only">Đang tải khóa học</span>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-32 rounded-full" />
          <Skeleton className="h-6 w-4/5 rounded-full" />
          <Skeleton className="h-3 w-2/5 rounded-full" />
        </div>
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-56 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-surface xl:block">
        <Skeleton className="aspect-video rounded-none" />
        <div className="flex flex-col gap-3 p-5">
          <Skeleton className="h-6 w-2/5 rounded-full" />
          <Skeleton className="h-11 rounded-xl" />
          <Skeleton className="h-11 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
