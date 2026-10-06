"use client";

import { getPusherClient } from "@/shared/libs/pusher/client";
import { useEffect, useRef } from "react";
import { NOTIFICATION_PUSHER_EVENT } from "../constants";
import { getNotificationChannelName } from "../utils";

/**
 * Nghe kênh thông báo private của người đang đăng nhập; có thông báo mới thì
 * gọi onNewNotification. Chưa cấu hình Pusher thì không làm gì, chuông vẫn
 * cập nhật khi mở panel hoặc quay lại tab.
 */
export function useNotificationChannel(
  userId: string,
  onNewNotification: () => void,
) {
  const onNewNotificationRef = useRef(onNewNotification);

  // Giữ handler mới nhất mà không phải nối lại kênh mỗi lần render
  useEffect(() => {
    onNewNotificationRef.current = onNewNotification;
  });

  useEffect(() => {
    const pusherClientPromise = getPusherClient();

    if (!userId || !pusherClientPromise) return;

    const channelName = getNotificationChannelName(userId);
    let isCancelled = false;

    function handleNewNotification() {
      onNewNotificationRef.current();
    }

    pusherClientPromise.then((pusherClient) => {
      if (isCancelled) return;

      pusherClient
        .subscribe(channelName)
        .bind(NOTIFICATION_PUSHER_EVENT, handleNewNotification);
    });

    return () => {
      isCancelled = true;
      pusherClientPromise.then((pusherClient) => {
        pusherClient
          .channel(channelName)
          ?.unbind(NOTIFICATION_PUSHER_EVENT, handleNewNotification);
        pusherClient.unsubscribe(channelName);
      });
    };
  }, [userId]);
}
