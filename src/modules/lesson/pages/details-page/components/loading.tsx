export interface LoadingProps {}

// Khung chờ cột bài học: video, tên bài + hai nút, hàng tab, khối nội dung
export function Loading(_props: LoadingProps) {
  return (
    <div aria-busy="true" className="min-w-0">
      <div className="skeleton aspect-video w-full lg:rounded-2xl" />
      <div className="mt-4 flex flex-col gap-4 px-4 lg:mt-5 lg:flex-row lg:items-end lg:justify-between lg:px-0">
        <div className="space-y-3">
          <div className="skeleton h-3 w-40 rounded-full" />
          <div className="skeleton h-5 w-72 max-w-full rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-3 lg:flex">
          <div className="skeleton h-10 rounded-xl lg:w-32" />
          <div className="skeleton h-10 rounded-xl lg:w-40" />
        </div>
      </div>
      <div className="mt-5 px-4 lg:mt-6 lg:px-0">
        <div className="flex gap-6 pb-3 shadow-[inset_0_-1px_0_var(--border-strong)]">
          <div className="skeleton h-3 w-16 rounded-full" />
          <div className="skeleton h-3 w-20 rounded-full" />
        </div>
        <div className="mt-4 space-y-3 rounded-2xl border border-border bg-surface p-5">
          <div className="skeleton h-3 w-11/12 rounded-full" />
          <div className="skeleton h-3 w-4/5 rounded-full" />
          <div className="skeleton h-3 w-2/3 rounded-full" />
        </div>
      </div>
      <span className="sr-only" role="status">
        Đang tải bài học
      </span>
    </div>
  );
}
