import Skeleton from "@/shared/components/skeleton";
import { NOTIFICATION_SKELETON_ROW_COUNT } from "../constants";

/** Cùng khung với NotificationItem: ô icon, hai dòng câu, dòng thời gian */
export function NotificationListSkeleton() {
  return (
    <ul aria-hidden className="flex flex-col gap-1 p-2">
      {Array.from({ length: NOTIFICATION_SKELETON_ROW_COUNT }, (_, index) => (
        <li key={index} className="flex gap-3 px-3 py-3">
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1">
            <div className="flex h-5 items-center">
              <Skeleton className="h-3 w-full rounded-full" />
            </div>
            <div className="flex h-5 items-center">
              <Skeleton className="h-3 w-3/5 rounded-full" />
            </div>
            <div className="mt-1 flex h-4 items-center">
              <Skeleton className="h-2.5 w-24 rounded-full" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
