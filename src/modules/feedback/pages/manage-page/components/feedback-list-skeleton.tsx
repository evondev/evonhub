import Skeleton from "@/shared/components/skeleton";
import { FEEDBACK_SKELETON_ROW_COUNT } from "../../../constants";

const skeletonRows = Array.from(
  { length: FEEDBACK_SKELETON_ROW_COUNT },
  (_, index) => index,
);

/** Khung chờ đúng hình danh sách: avatar, tên, hai đoạn góp ý, giờ bên phải */
export function FeedbackListSkeleton() {
  return (
    <div
      aria-busy="true"
      className="overflow-hidden rounded-2xl border border-border bg-surface"
    >
      <ul>
        {skeletonRows.map((rowIndex) => (
          <li
            key={rowIndex}
            className="flex gap-3 border-b border-border px-4 py-4 last:border-0 sm:px-5"
          >
            <Skeleton className="size-9 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2.5 pt-0.5">
              <Skeleton className="h-3.5 w-36 rounded-full" />
              <Skeleton className="h-3.5 w-full max-w-lg rounded-full" />
              <Skeleton className="h-3.5 w-full max-w-md rounded-full" />
            </div>
            <Skeleton className="h-3 w-16 shrink-0 rounded-full" />
          </li>
        ))}
      </ul>
      <span className="sr-only" role="status">
        Đang tải
      </span>
    </div>
  );
}
