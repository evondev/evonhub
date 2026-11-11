import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/shared/components/common/user-avatar";
import { cn } from "@/shared/utils";
import { SupportConversationItem } from "../../../types";
import { formatSupportMessageTime, formatSupportPreview } from "../../../utils";

interface SupportInboxItemProps {
  conversation: SupportConversationItem;
  isSelected: boolean;
  onSelect: (conversationId: string) => void;
}

/** Một dòng trong hộp thư: chưa đọc thì chữ đậm, có chấm */
export function SupportInboxItem({
  conversation,
  isSelected,
  onSelect,
}: SupportInboxItemProps) {
  const { user, isUnreadByAdmin } = conversation;

  return (
    <li>
      <Button
        type="button"
        aria-current={isSelected ? "true" : undefined}
        onClick={() => onSelect(conversation.id)}
        className={cn(
          "h-auto w-full justify-start gap-3 rounded-xl px-3 py-2.5 text-left font-normal focus-visible:ring-2 focus-visible:ring-primary/30",
          isSelected && "bg-foreground/[0.06]",
          !isSelected && "hover:bg-foreground/[0.04]",
        )}
      >
        <UserAvatar name={user.name} avatar={user.avatar} className="size-10" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p
              className={cn(
                "truncate text-sm text-foreground",
                isUnreadByAdmin && "font-semibold",
                !isUnreadByAdmin && "font-medium",
              )}
            >
              {user.name}
            </p>
            <time
              dateTime={conversation.lastMessageAt}
              className="shrink-0 text-xs tabular-nums text-muted"
            >
              {formatSupportMessageTime(conversation.lastMessageAt)}
            </time>
          </div>
          <div className="mt-0.5 flex items-center gap-2">
            <p
              className={cn(
                "min-w-0 flex-1 truncate text-sm",
                isUnreadByAdmin && "font-medium text-foreground",
                !isUnreadByAdmin && "text-muted",
              )}
            >
              {formatSupportPreview(
                conversation.lastMessagePreview,
                conversation.lastSenderIsAdmin,
              )}
            </p>
            {isUnreadByAdmin && (
              <span className="size-2 shrink-0 rounded-full bg-primary">
                <span className="sr-only">Chưa đọc</span>
              </span>
            )}
          </div>
        </div>
      </Button>
    </li>
  );
}
