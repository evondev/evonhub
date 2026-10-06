"use client";

import {
  getPusherClient,
  IS_PUSHER_CONFIGURED,
} from "@/shared/libs/pusher/client";
import type { Members, PresenceChannel } from "pusher-js";
import { useEffect, useRef, useState } from "react";
import {
  CHAT_CHANNEL_NAME,
  CHAT_EVENTS,
  CHAT_POLL_INTERVAL_MS,
} from "../constants";
import {
  ChatMessageDeletedPayload,
  ChatMessageItem,
  ChatSender,
  UseChatChannelHandlers,
} from "../types";
import { toOnlineMembers } from "../utils";

/**
 * Nối vào presence channel của phòng chat: nhận tin mới, tin bị xoá và danh
 * sách người online. Chưa cấu hình Pusher thì hỏi tin mới theo nhịp thay thế.
 */
export function useChatChannel(handlers: UseChatChannelHandlers) {
  const [onlineMembers, setOnlineMembers] = useState<ChatSender[]>([]);
  const handlersRef = useRef(handlers);

  // Giữ handler mới nhất mà không phải nối lại kênh mỗi lần render
  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    const pusherClientPromise = getPusherClient();

    if (!pusherClientPromise) {
      const pollTimer = window.setInterval(
        () => handlersRef.current.onSync(),
        CHAT_POLL_INTERVAL_MS,
      );

      return () => window.clearInterval(pollTimer);
    }

    let isCancelled = false;

    // Dùng chung kết nối với chuông thông báo, chỉ thêm kênh chat
    pusherClientPromise.then((pusherClient) => {
      if (isCancelled) return;

      const channel = pusherClient.subscribe(
        CHAT_CHANNEL_NAME,
      ) as PresenceChannel;

      function refreshOnlineMembers() {
        setOnlineMembers(toOnlineMembers(channel.members));
      }

      // Chạy cả lần đầu lẫn mỗi lần nối lại sau khi rớt mạng
      channel.bind("pusher:subscription_succeeded", (members: Members) => {
        setOnlineMembers(toOnlineMembers(members));
        handlersRef.current.onSync();
      });
      channel.bind("pusher:member_added", refreshOnlineMembers);
      channel.bind("pusher:member_removed", refreshOnlineMembers);
      channel.bind(CHAT_EVENTS.MESSAGE_NEW, (message: ChatMessageItem) =>
        handlersRef.current.onMessage(message),
      );
      channel.bind(
        CHAT_EVENTS.MESSAGE_DELETED,
        (payload: ChatMessageDeletedPayload) =>
          handlersRef.current.onMessageDeleted(payload.messageId),
      );
    });

    // Rời trang chat chỉ bỏ kênh chat (người khác thấy mình offline), giữ kết nối
    return () => {
      isCancelled = true;
      pusherClientPromise.then((pusherClient) => {
        pusherClient.unsubscribe(CHAT_CHANNEL_NAME);
      });
    };
  }, []);

  return { onlineMembers, isRealtimeEnabled: IS_PUSHER_CONFIGURED };
}
