import { htmlToPlainText, sanitizeHtml } from "@/shared/helpers";
import { cn } from "@/shared/utils";
import { Fragment } from "react";
import { NotificationItemData } from "../types";
import { getNotificationMessage } from "../utils";

interface NotificationMessageProps {
  notification: NotificationItemData;
  isUnread: boolean;
}

/**
 * Câu thông báo, tối đa 3 dòng. Thông báo có type thì ghép từ data bằng chữ
 * thường; thông báo cũ chỉ có content HTML nên vẫn làm sạch rồi hiện như trước.
 */
export function NotificationMessage({
  notification,
  isUnread,
}: NotificationMessageProps) {
  const className = cn(
    "line-clamp-3 text-sm",
    isUnread && "text-foreground",
    !isUnread && "text-foreground/70",
  );

  if (!notification.type) {
    return (
      <p
        title={htmlToPlainText(notification.content ?? "")}
        className={cn(className, "[&_strong]:font-medium")}
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(notification.content ?? ""),
        }}
      />
    );
  }

  const messageParts = getNotificationMessage(notification);
  const plainMessage = messageParts.map((part) => part.text).join("");

  return (
    <p title={plainMessage} className={className}>
      {messageParts.map((part, index) => (
        <Fragment key={index}>
          {part.isHighlight && (
            <span className="font-medium">{part.text}</span>
          )}
          {!part.isHighlight && part.text}
        </Fragment>
      ))}
    </p>
  );
}
