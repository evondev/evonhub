"use client";

import { Button } from "@/components/ui/button";
import { MenuLinkSignalDot } from "@/shared/components/common/menu-link-signal-dot";
import { UserAvatar } from "@/shared/components/common/user-avatar";
import { CHAT_PATH } from "@/shared/constants/common.constants";
import { MessagesSquare, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChatHost } from "../types";
import {
  dismissChatHostBubble,
  isChatHostBubbleDismissed,
} from "../utils/chat-activity.utils";

interface ChatHostBubbleProps {
  host: ChatHost;
}

/**
 * Góc dưới bên phải: admin đang trong phòng chat thì mời học viên vào thảo
 * luận. Nảy vài cái lúc hiện ra rồi đứng yên, nảy mãi thì phiền khi đang đọc.
 * Tắt bằng nút X thì ẩn tới hết phiên.
 */
export function ChatHostBubble({ host }: ChatHostBubbleProps) {
  // Mặc định ẩn: storage chỉ đọc được ở client, hiện trước rồi mới ẩn thì nhấp nháy
  const [isDismissed, setIsDismissed] = useState(true);
  const hostName = host.name || "Admin";

  useEffect(() => {
    setIsDismissed(isChatHostBubbleDismissed());
  }, []);

  function handleDismiss() {
    dismissChatHostBubble();
    setIsDismissed(true);
  }

  if (isDismissed) return null;

  return (
    // Mobile: nằm trên thanh điều hướng dưới (64px) và vùng an toàn của iPhone.
    // Đổi admin thì key đổi, cả cụm gắn lại và nảy lại để học viên để ý
    <div
      key={hostName}
      className="group fixed bottom-[calc(5rem_+_env(safe-area-inset-bottom))] right-4 z-30 animate-bounce [animation-iteration-count:3] motion-reduce:animate-none lg:bottom-6 lg:right-6"
    >
      <Link
        href={CHAT_PATH}
        aria-label={`${hostName} đang online, vào phòng trò chuyện`}
        className="flex items-center gap-3 rounded-full border border-border bg-surface py-1.5 pl-1.5 pr-3 shadow-popover outline-none transition-colors hover:bg-item-hover focus-visible:ring-2 focus-visible:ring-primary sm:pr-4"
      >
        <span className="relative shrink-0">
          <UserAvatar
            name={hostName}
            avatar={host.avatar}
            className="size-10"
          />
          <MenuLinkSignalDot
            isUnread={false}
            isPinging
            hasRing
            className="absolute bottom-0 right-0"
          />
        </span>
        <span className="hidden min-w-0 flex-col sm:flex">
          <span className="max-w-48 truncate text-sm font-semibold text-foreground">
            {hostName} đang online
          </span>
          <span className="text-xs text-muted">
            Vào phòng chat thảo luận nhé
          </span>
        </span>
        <MessagesSquare
          aria-hidden="true"
          className="size-5 shrink-0 text-primary"
        />
      </Link>
      {/* Nằm ngoài Link: nút trong link là HTML sai. Desktop chỉ hiện khi rê
          vào cho gọn, cảm ứng không rê được nên luôn hiện */}
      <Button
        aria-label="Ẩn lời mời vào chat"
        onClick={handleDismiss}
        className="absolute -left-1.5 -top-1.5 size-6 rounded-full border border-border bg-surface p-0 text-muted shadow-popover hover:bg-item-hover hover:text-foreground lg:opacity-0 lg:focus-visible:opacity-100 lg:group-hover:opacity-100"
      >
        <X className="size-3.5" />
      </Button>
    </div>
  );
}
