import { LoadErrorState } from "@/shared/components/common/load-error-state";
import { cn } from "@/shared/utils";
import { CHAT_FRAME_HEIGHT_CLASS_NAME } from "../../../constants";

interface ChatRoomErrorProps {
  className?: string;
}

/** Chưa tải được phòng: giữ nguyên khung chat để trang không nhảy, lỗi nằm giữa khung */
export function ChatRoomError({
  className = CHAT_FRAME_HEIGHT_CLASS_NAME,
}: ChatRoomErrorProps) {
  return (
    <div
      data-chat-room
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-border bg-surface",
        className,
      )}
    >
      <div className="flex h-14 shrink-0 items-center border-b border-border px-4 sm:px-5">
        <span className="truncate text-sm font-semibold text-foreground">
          Phòng chung
        </span>
      </div>
      <LoadErrorState
        title="Chưa tải được phòng chat"
        className="flex-1 justify-center rounded-none border-0"
      />
    </div>
  );
}
