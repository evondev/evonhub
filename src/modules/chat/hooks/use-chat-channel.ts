"use client";

import type PusherClient from "pusher-js";
import type { Members, PresenceChannel } from "pusher-js";
import { useEffect, useRef, useState } from "react";
import {
  CHAT_CHANNEL_NAME,
  CHAT_EVENTS,
  CHAT_POLL_INTERVAL_MS,
  CHAT_PUSHER_AUTH_ENDPOINT,
} from "../constants";
import {
  ChatMessageDeletedPayload,
  ChatMessageItem,
  ChatSender,
  UseChatChannelHandlers,
} from "../types";
import { toOnlineMembers } from "../utils";

// Next thay NEXT_PUBLIC_* lúc build nên phải đọc đúng tên biến, không destructure
const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY;
const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
const IS_REALTIME_ENABLED = Boolean(PUSHER_KEY && PUSHER_CLUSTER);

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
    const pusherKey = PUSHER_KEY;
    const pusherCluster = PUSHER_CLUSTER;

    if (!pusherKey || !pusherCluster) {
      const pollTimer = window.setInterval(
        () => handlersRef.current.onSync(),
        CHAT_POLL_INTERVAL_MS,
      );

      return () => window.clearInterval(pollTimer);
    }

    let isCancelled = false;
    let pusherClient: PusherClient | null = null;

    // Tải lười: chỉ trang chat mới kéo pusher-js về
    import("pusher-js").then(({ default: Pusher }) => {
      if (isCancelled) return;

      pusherClient = new Pusher(pusherKey, {
        cluster: pusherCluster,
        channelAuthorization: {
          endpoint: CHAT_PUSHER_AUTH_ENDPOINT,
          transport: "ajax",
        },
      });

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

    return () => {
      isCancelled = true;
      pusherClient?.disconnect();
    };
  }, []);

  return { onlineMembers, isRealtimeEnabled: IS_REALTIME_ENABLED };
}
