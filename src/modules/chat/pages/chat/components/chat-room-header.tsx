import { ChatSender } from "../../../types";
import { ChatExpiryBadge } from "./chat-expiry-badge";
import { ChatOnlineList } from "./chat-online-list";

interface ChatRoomHeaderProps {
  onlineMembers: ChatSender[];
  isRealtimeEnabled: boolean;
  minutesLeft: number;
}

/** Đầu khung chat: ai đang online bên trái, hạn xoá tin bên phải */
export function ChatRoomHeader({
  onlineMembers,
  isRealtimeEnabled,
  minutesLeft,
}: ChatRoomHeaderProps) {
  return (
    <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4 sm:px-5">
      <div className="relative min-w-0 flex-1">
        {isRealtimeEnabled && <ChatOnlineList members={onlineMembers} />}
        {/* Chưa cấu hình Pusher thì không biết ai online */}
        {!isRealtimeEnabled && (
          <span className="truncate text-sm font-semibold text-foreground">
            Phòng chung
          </span>
        )}
      </div>
      <ChatExpiryBadge minutesLeft={minutesLeft} />
    </div>
  );
}
