"use client";

import { getNotificationChannelName } from "@/modules/notifications/utils/notification-channel.utils";
import { getPusherClient } from "@/shared/libs/pusher/client";
import { useEffect, useRef } from "react";
import { SUPPORT_PUSHER_EVENT } from "../constants";

/**
 * Nghe tín hiệu "có tin hỗ trợ mới" trên kênh thông báo riêng của người đang
 * đăng nhập. Chưa cấu hình Pusher thì không làm gì, query tự hỏi theo nhịp.
 */
export function useSupportChannel(userId: string, onNewMessage: () => void) {
  const onNewMessageRef = useRef(onNewMessage);

  // Giữ handler mới nhất mà không phải nối lại kênh mỗi lần render
  useEffect(() => {
    onNewMessageRef.current = onNewMessage;
  });

  useEffect(() => {
    const pusherClientPromise = getPusherClient();

    if (!userId || !pusherClientPromise) return;

    const channelName = getNotificationChannelName(userId);
    let isCancelled = false;

    function handleNewMessage() {
      onNewMessageRef.current();
    }

    // Kênh này chuông thông báo cũng đang nghe: subscribe trả lại kênh sẵn có
    pusherClientPromise.then((pusherClient) => {
      if (isCancelled) return;

      pusherClient
        .subscribe(channelName)
        .bind(SUPPORT_PUSHER_EVENT, handleNewMessage);
    });

    // Chỉ gỡ handler của mình, không unsubscribe: chuông vẫn cần kênh
    return () => {
      isCancelled = true;
      pusherClientPromise.then((pusherClient) => {
        pusherClient
          .channel(channelName)
          ?.unbind(SUPPORT_PUSHER_EVENT, handleNewMessage);
      });
    };
  }, [userId]);
}
