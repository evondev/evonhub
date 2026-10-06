import { cn } from "@/shared/utils";
import { getTimestamp } from "@/utils";
import Link from "next/link";
import {
  LEGACY_NOTIFICATION_ICON,
  notificationTypeIcons,
  notificationTypeLabels,
} from "../constants";
import { NotificationGroup } from "../types";
import { getNotificationLink } from "../utils";
import { NotificationMessage } from "./notification-message";

interface NotificationItemProps {
  group: NotificationGroup;
  onNavigate: () => void;
}

/**
 * Một dòng thông báo (một thông báo, hoặc một nhóm đã gộp): icon theo loại, câu,
 * nguồn và thời gian của cái mới nhất, chấm chưa đọc bên phải. Có link thì cả
 * hàng là link; thông báo cũ không có link thì để tĩnh.
 */
export function NotificationItem({ group, onNavigate }: NotificationItemProps) {
  const notification = group.latest;
  const isUnread = group.isUnread;
  const createdAt = new Date(notification.createdAt);
  const link = getNotificationLink(notification);
  const NotificationIcon = notification.type
    ? notificationTypeIcons[notification.type]
    : LEGACY_NOTIFICATION_ICON;
  const sourceLabel = notification.type
    ? notificationTypeLabels[notification.type]
    : notification.title;
  const rowClassName = cn(
    "flex w-full gap-3 rounded-lg px-3 py-3",
    link && "transition-colors hover:bg-item-hover",
  );

  const rowContent = (
    <>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground/5 text-muted">
        <NotificationIcon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <NotificationMessage group={group} />
        <p className="mt-1 text-xs text-muted">
          {sourceLabel} ·{" "}
          <time dateTime={createdAt.toISOString()}>
            {getTimestamp(createdAt)}
          </time>
        </p>
      </div>
      {/* Luôn giữ chỗ chấm để chữ của mục đã đọc và chưa đọc xuống dòng như nhau */}
      <span
        className={cn(
          "mt-1.5 size-2 shrink-0 rounded-full",
          isUnread && "bg-foreground",
        )}
      >
        {isUnread && <span className="sr-only">Chưa đọc</span>}
      </span>
    </>
  );

  return (
    <li data-peek-item>
      {link && (
        <Link href={link} onClick={onNavigate} className={rowClassName}>
          {rowContent}
        </Link>
      )}
      {!link && <div className={rowClassName}>{rowContent}</div>}
    </li>
  );
}
