import { Loader2 } from "lucide-react";
import { ChatMessageListContext } from "../../../types";

interface ChatMessageListHeaderProps {
  context?: ChatMessageListContext;
}

/** Đầu danh sách: đang tải tin cũ, hoặc đã tới tin đầu tiên của ngày */
export function ChatMessageListHeader({ context }: ChatMessageListHeaderProps) {
  if (context?.isLoadingOlder) {
    return (
      <div className="flex justify-center py-4 text-muted">
        <Loader2 className="size-4 animate-spin" aria-label="Đang tải tin cũ" />
      </div>
    );
  }

  if (context?.hasMore) return <div className="h-4" />;

  return (
    <p className="px-4 pb-1 pt-5 text-center text-xs text-muted sm:px-5">
      Hôm nay · tin nhắn chỉ giữ trong ngày, tự xoá lúc 00:00
    </p>
  );
}
