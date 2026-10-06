import Skeleton from "@/shared/components/skeleton";
import { cn } from "@/shared/utils";
import {
  CHAT_FRAME_HEIGHT_CLASS_NAME,
  chatSkeletonLineWidths,
} from "../../../constants";

interface ChatRoomSkeletonProps {
  className?: string;
}

/** Khung chờ đúng hình phòng chat: đầu khung, vài tin, ô soạn */
export function ChatRoomSkeleton({
  className = CHAT_FRAME_HEIGHT_CLASS_NAME,
}: ChatRoomSkeletonProps) {
  return (
    <div
      data-chat-room
      aria-busy="true"
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-border bg-surface",
        className,
      )}
    >
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4 sm:px-5">
        <Skeleton className="h-7 w-32 rounded-full" />
        <Skeleton className="ml-auto h-7 w-20 rounded-full" />
      </div>
      <div className="flex flex-1 flex-col justify-end gap-5 overflow-hidden px-4 pb-4 sm:px-5">
        {chatSkeletonLineWidths.map((lineWidth) => (
          <div key={lineWidth} className="flex gap-3">
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2 pt-1">
              <Skeleton className="h-3 w-28 rounded-full" />
              <Skeleton className={cn("h-3 max-w-md rounded-full", lineWidth)} />
            </div>
          </div>
        ))}
      </div>
      <div className="shrink-0 px-3 pb-3 sm:px-4 sm:pb-4">
        <Skeleton className="h-[58px] w-full rounded-3xl" />
      </div>
    </div>
  );
}
