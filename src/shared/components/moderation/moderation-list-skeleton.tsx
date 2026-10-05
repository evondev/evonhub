import Skeleton from "@/shared/components/skeleton";

/** Gần bằng một trang thật */
const skeletonRowCount = 6;

const skeletonRows = Array.from(
  { length: skeletonRowCount },
  (_, index) => index,
);

interface ModerationListSkeletonProps {
  /** Chữ của hàng đầu, như danh sách thật */
  label: string;
}

/** Khung chờ đúng hình danh sách: hàng chọn tất cả, dòng avatar + tên + hai dòng nội dung + ngữ cảnh */
export function ModerationListSkeleton({ label }: ModerationListSkeletonProps) {
  return (
    <div
      aria-busy="true"
      className="overflow-hidden rounded-2xl border border-border bg-surface"
    >
      <div className="flex h-14 items-center gap-3 border-b border-border px-4 sm:h-12 sm:px-5">
        <div className="size-4" />
        <span className="text-xs font-medium text-muted">{label}</span>
      </div>
      <ul>
        {skeletonRows.map((rowIndex) => (
          <li
            key={rowIndex}
            className="flex gap-3 border-b border-border px-4 py-4 last:border-0 sm:px-5"
          >
            <div className="flex h-9 shrink-0 items-center">
              <Skeleton className="size-4 rounded" />
            </div>
            <Skeleton className="size-9 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2.5 pt-1">
              <Skeleton className="h-3.5 w-40 rounded-full" />
              <Skeleton className="h-3.5 w-full max-w-xl rounded-full" />
              <Skeleton className="h-3.5 w-3/5 max-w-sm rounded-full" />
              <Skeleton className="h-3 w-56 rounded-full" />
            </div>
            <div className="hidden shrink-0 gap-1.5 sm:flex">
              <Skeleton className="h-8 w-[84px] rounded-lg" />
              <Skeleton className="h-8 w-[88px] rounded-lg" />
            </div>
          </li>
        ))}
      </ul>
      <span className="sr-only" role="status">
        Đang tải
      </span>
    </div>
  );
}
