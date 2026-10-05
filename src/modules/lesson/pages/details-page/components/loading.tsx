import { LoadingOutline } from "./loading-outline";

export interface LoadingProps {}

// Khung chờ cột bài học: video, tên bài + hai nút, hàng tab, nội dung tab. Màn
// hẹp mở sẵn tab Mục lục, từ lg mở tab Ghi chú, như LessonTabs.
export function Loading(_props: LoadingProps) {
  return (
    <div aria-busy="true" className="min-w-0">
      <div className="skeleton aspect-video w-full lg:rounded-2xl" />
      <div className="mt-4 flex flex-col gap-4 px-4 lg:mt-5 lg:flex-row lg:items-end lg:justify-between lg:px-0">
        <div className="min-w-0 space-y-3">
          <div className="skeleton h-3 w-40 rounded-full" />
          <div className="skeleton h-5 w-72 max-w-full rounded-full" />
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-3 lg:flex">
          <div className="skeleton h-10 rounded-xl lg:w-40" />
          <div className="skeleton h-10 rounded-xl lg:w-40" />
        </div>
      </div>
      <div className="mt-5 px-4 lg:mt-6 lg:px-0">
        <div className="flex gap-2 shadow-[inset_0_-1px_0_var(--border-strong)]">
          <div className="flex h-[41px] items-center px-2 lg:hidden">
            <div className="skeleton h-3 w-14 rounded-full" />
          </div>
          <div className="flex h-[41px] items-center px-2">
            <div className="skeleton h-3 w-14 rounded-full" />
          </div>
          <div className="flex h-[41px] items-center px-2">
            <div className="skeleton h-3 w-16 rounded-full" />
          </div>
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface lg:hidden">
          <div className="px-4 pb-3 pt-4">
            <div className="flex items-center justify-between gap-3">
              <div className="skeleton h-3 w-28 rounded-full" />
              <div className="skeleton h-3 w-8 rounded-full" />
            </div>
            <div className="skeleton mt-2 h-2 w-full rounded-full" />
          </div>
          <LoadingOutline />
        </div>
        <div className="mt-4 hidden space-y-3 rounded-2xl border border-border bg-surface p-5 lg:block">
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
