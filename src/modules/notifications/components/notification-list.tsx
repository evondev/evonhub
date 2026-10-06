"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  NOTIFICATION_LIST_MAX_HEIGHT,
  NOTIFICATION_LIST_VIEWPORT_OFFSET,
} from "../constants";
import { NotificationItemData } from "../types";
import { getPeekListHeight, groupNotifications } from "../utils";
import { NotificationItem } from "./notification-item";

interface NotificationListProps {
  notifications: NotificationItemData[];
  seenAt: string | null;
  onNavigate: () => void;
}

/**
 * Danh sách cuộn trong panel. Thông báo dài ngắn khác nhau nên chiều cao tính
 * lúc mở, cắt ngang giữa một mục để thấy còn mục bên dưới.
 */
export function NotificationList({
  notifications,
  seenAt,
  onNavigate,
}: NotificationListProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const notificationGroups = useMemo(
    () => groupNotifications(notifications, seenAt),
    [notifications, seenAt],
  );
  const [listHeight, setListHeight] = useState<number>();

  useLayoutEffect(() => {
    if (!listRef.current) return;

    const maxHeight = Math.min(
      NOTIFICATION_LIST_MAX_HEIGHT,
      window.innerHeight - NOTIFICATION_LIST_VIEWPORT_OFFSET,
    );

    setListHeight(getPeekListHeight(listRef.current, maxHeight));
  }, [notificationGroups]);

  return (
    // Khe phải trừ 4px của thanh cuộn; rãnh lùi 8px dưới đường kẻ và 16px ở góc bo dưới
    <ul
      ref={listRef}
      style={{ maxHeight: listHeight }}
      className="scrollbar-auto-hide flex flex-col gap-1 overflow-y-auto py-2 pl-2 pr-1 [scrollbar-gutter:stable] [&::-webkit-scrollbar-track]:mb-4 [&::-webkit-scrollbar-track]:mt-2"
    >
      {notificationGroups.map((group) => (
        <NotificationItem
          key={group.key}
          group={group}
          onNavigate={onNavigate}
        />
      ))}
    </ul>
  );
}
