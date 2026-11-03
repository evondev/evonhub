"use client";

import { getPusherClient } from "@/shared/libs/pusher/client";
import { MenuLinkSignal } from "@/shared/types";
import { useEffect, useState } from "react";
import { fetchChatActivity } from "../actions";
import {
  CHAT_ACTIVITY_CHANNEL_NAME,
  CHAT_ACTIVITY_EVENT,
  CHAT_ACTIVITY_POLL_INTERVAL_MS,
} from "../constants";
import {
  ChatActivity,
  ChatActivityEventPayload,
  ChatActivityState,
  UseChatActivityParams,
} from "../types";
import {
  describeChatActivity,
  getTodayLastMessageTime,
  hasUnreadChat,
  isChatLively,
  readChatLastSeenAt,
  saveChatLastSeenAt,
} from "../utils/chat-activity.utils";

const EMPTY_CHAT_ACTIVITY: ChatActivity = {
  onlineCount: 0,
  host: null,
  lastMessageAt: null,
};

/** Mốc nào mới hơn: kết quả cache của server có thể cũ hơn tin vừa nhận qua Pusher */
function pickLaterMessageAt(
  currentMessageAt: string | null,
  nextMessageAt: string | null,
): string | null {
  if (!currentMessageAt) return nextMessageAt;
  if (!nextMessageAt) return currentMessageAt;

  return new Date(nextMessageAt) > new Date(currentMessageAt)
    ? nextMessageAt
    : currentMessageAt;
}

/**
 * Chạy ở layout của mọi trang: import thẳng từ file, không qua barrel utils kéo
 * theo code của trang chat.
 *
 * Tín hiệu cho mục Trò chuyện trên menu (bao nhiêu người trong phòng, có tin
 * chưa đọc không, phòng có đang sôi nổi không) và admin nào đang trong phòng.
 * Tin mới về tức thì qua kênh public; số người và admin hỏi lại theo nhịp khi
 * tab đang mở.
 */
export function useChatActivity({
  userId,
  isOnChatPage,
  isEnabled,
}: UseChatActivityParams): ChatActivityState {
  const [activity, setActivity] = useState<ChatActivity>(EMPTY_CHAT_ACTIVITY);
  const [lastSeenAt, setLastSeenAt] = useState<number | null>(null);
  // Mốc "bây giờ" đổi theo mỗi lần cập nhật, để chấm nhấp nháy tự tắt khi phòng lặng
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setLastSeenAt(userId ? readChatLastSeenAt(userId) : null);
  }, [userId]);

  useEffect(() => {
    if (!isEnabled) return;

    let isCancelled = false;

    async function refreshActivity() {
      if (document.visibilityState !== "visible") return;

      const nextActivity = await fetchChatActivity();

      if (isCancelled) return;

      setActivity((currentActivity) => ({
        onlineCount: nextActivity.onlineCount,
        host: nextActivity.host,
        lastMessageAt: pickLaterMessageAt(
          currentActivity.lastMessageAt,
          nextActivity.lastMessageAt,
        ),
      }));
      setNow(Date.now());
    }

    void refreshActivity();

    const pollTimer = window.setInterval(
      refreshActivity,
      CHAT_ACTIVITY_POLL_INTERVAL_MS,
    );

    // Quay lại tab thì cập nhật ngay, không chờ tới nhịp sau
    document.addEventListener("visibilitychange", refreshActivity);

    return () => {
      isCancelled = true;
      window.clearInterval(pollTimer);
      document.removeEventListener("visibilitychange", refreshActivity);
    };
  }, [isEnabled]);

  useEffect(() => {
    const pusherClientPromise = getPusherClient();

    if (!isEnabled || !pusherClientPromise) return;

    let isCancelled = false;

    function handleChatActivity(payload: ChatActivityEventPayload) {
      setActivity((currentActivity) => ({
        ...currentActivity,
        lastMessageAt: payload.lastMessageAt,
      }));
      setNow(Date.now());
    }

    // Dùng chung kết nối với chuông thông báo, chỉ thêm một kênh public
    pusherClientPromise.then((pusherClient) => {
      if (isCancelled) return;

      pusherClient
        .subscribe(CHAT_ACTIVITY_CHANNEL_NAME)
        .bind(CHAT_ACTIVITY_EVENT, handleChatActivity);
    });

    return () => {
      isCancelled = true;
      pusherClientPromise.then((pusherClient) => {
        pusherClient
          .channel(CHAT_ACTIVITY_CHANNEL_NAME)
          ?.unbind(CHAT_ACTIVITY_EVENT, handleChatActivity);
        pusherClient.unsubscribe(CHAT_ACTIVITY_CHANNEL_NAME);
      });
    };
  }, [isEnabled]);

  // Đang ở phòng thì tin nào về cũng coi như đã đọc. Ghi cả lúc rời phòng.
  // Lấy mốc muộn hơn giữa giờ máy và giờ tin: đồng hồ máy chậm hơn server
  // thì tin vừa đọc không bị tính là tin mới
  useEffect(() => {
    if (!userId || !isOnChatPage) return;

    function markChatSeen() {
      const lastMessageTime = activity.lastMessageAt
        ? new Date(activity.lastMessageAt).getTime()
        : 0;
      const seenAt = Math.max(Date.now(), lastMessageTime);

      saveChatLastSeenAt(userId, seenAt);
      setLastSeenAt(seenAt);
    }

    markChatSeen();

    return markChatSeen;
  }, [userId, isOnChatPage, activity.lastMessageAt]);

  const lastMessageTime = getTodayLastMessageTime(activity.lastMessageAt, now);
  const menuSignal: MenuLinkSignal = {
    count: activity.onlineCount,
    hasUnread:
      Boolean(userId) &&
      !isOnChatPage &&
      hasUnreadChat(lastMessageTime, lastSeenAt),
    isLive: isChatLively(lastMessageTime, now),
    description: describeChatActivity(
      activity.onlineCount,
      lastMessageTime,
      now,
    ),
  };

  const hasMenuSignal = menuSignal.count > 0 || menuSignal.hasUnread;

  if (!isEnabled) return { menuSignal: null, host: null };

  return {
    menuSignal: hasMenuSignal ? menuSignal : null,
    // Đang ở trong phòng rồi thì không cần mời vào
    host: isOnChatPage ? null : activity.host,
  };
}
