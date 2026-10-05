import { skeletonChapterWidths } from "@/modules/lesson/constants";
import { cn } from "@/shared/utils";

export interface LoadingOutlineProps {}

// Khung chờ đúng hình hàng chương: tên chương + dòng "x / y bài"
export function LoadingOutline(_props: LoadingOutlineProps) {
  return (
    <div
      aria-busy="true"
      className="divide-y divide-border border-t border-border"
    >
      {skeletonChapterWidths.map((width) => (
        <div key={width} className="space-y-2 px-5 py-4">
          <div className={cn("skeleton h-3 rounded-full", width)} />
          <div className="skeleton h-3 w-1/4 rounded-full" />
        </div>
      ))}
      <span className="sr-only" role="status">
        Đang tải mục lục
      </span>
    </div>
  );
}
