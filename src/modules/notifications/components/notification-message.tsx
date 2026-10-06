import { htmlToPlainText, sanitizeHtml } from "@/shared/helpers";
import { cn } from "@/shared/utils";
import { Fragment } from "react";
import { NotificationGroup } from "../types";
import { getNotificationMessage } from "../utils";

interface NotificationMessageProps {
  group: NotificationGroup;
}

/**
 * Câu thông báo, tối đa 3 dòng. Thông báo có type thì ghép từ data bằng chữ
 * thường (nhóm thì ghép theo số lượng); thông báo cũ chỉ có content HTML nên
 * vẫn làm sạch rồi hiện như trước.
 */
export function NotificationMessage({ group }: NotificationMessageProps) {
  const notification = group.latest;
  const className = cn(
    "line-clamp-3 text-sm",
    group.isUnread && "text-foreground",
    !group.isUnread && "text-foreground/70",
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

  const messageParts = getNotificationMessage(group);
  const plainMessage = messageParts.map((part) => part.text).join("");

  return (
    <p title={plainMessage} className={className}>
      {messageParts.map((part, index) => (
        <Fragment key={index}>
          {part.isHighlight && <span className="font-medium">{part.text}</span>}
          {!part.isHighlight && part.text}
        </Fragment>
      ))}
    </p>
  );
}
