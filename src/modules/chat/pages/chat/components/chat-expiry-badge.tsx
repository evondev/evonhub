import { cn } from "@/shared/utils";
import { Clock } from "lucide-react";
import { CHAT_EXPIRY_WARNING_MINUTES } from "../../../constants";

interface ChatExpiryBadgeProps {
  minutesLeft: number;
}

/**
 * Hạn tin hôm nay. Còn dưới một giờ thì đổi màu cảnh báo và đếm phút, để ai
 * cần lưu đoạn code nào thì kịp copy về trước 00:00
 */
export function ChatExpiryBadge({ minutesLeft }: ChatExpiryBadgeProps) {
  const isExpiringSoon = minutesLeft <= CHAT_EXPIRY_WARNING_MINUTES;

  return (
    <span
      title="Tin hôm nay tự xoá lúc 00:00"
      // Server và trình duyệt có thể lệch nhau một phút lúc render đầu
      suppressHydrationWarning
      className={cn(
        "inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium",
        isExpiringSoon &&
          "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
        !isExpiringSoon && "bg-foreground/5 text-muted",
      )}
    >
      <Clock className="size-3.5" />
      {isExpiringSoon && `${minutesLeft} phút`}
      {!isExpiringSoon && "00:00"}
    </span>
  );
}
