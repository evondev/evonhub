import { cn } from "@/shared/utils";
import { SupportMessageItem } from "../types";
import { formatSupportMessageTime } from "../utils";

interface SupportMessageBubbleProps {
  message: SupportMessageItem;
  /** Tin của người đang xem: nằm bên phải, nền màu nhấn */
  isOwn: boolean;
}

export function SupportMessageBubble({
  message,
  isOwn,
}: SupportMessageBubbleProps) {
  return (
    <li
      className={cn(
        "flex max-w-[85%] flex-col gap-1 sm:max-w-[70%]",
        isOwn && "items-end self-end",
        !isOwn && "items-start self-start",
      )}
    >
      <p
        className={cn(
          "whitespace-pre-line break-words rounded-2xl px-3.5 py-2 text-sm/6",
          isOwn && "rounded-br-md bg-primary text-primary-foreground",
          !isOwn && "rounded-bl-md bg-foreground/5 text-foreground",
        )}
      >
        {message.content}
      </p>
      <time
        dateTime={message.createdAt}
        className="px-1 text-xs tabular-nums text-muted"
      >
        {formatSupportMessageTime(message.createdAt)}
      </time>
    </li>
  );
}
