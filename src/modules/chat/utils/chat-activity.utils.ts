import {
  CHAT_HOST_BUBBLE_DISMISSED_STORAGE_KEY,
  CHAT_LAST_SEEN_STORAGE_KEY_PREFIX,
  CHAT_LIVELY_WINDOW_MS,
} from "../constants";
import { getVietnamStartOfDay } from "./chat-date.utils";

function getChatLastSeenStorageKey(userId: string) {
  return `${CHAT_LAST_SEEN_STORAGE_KEY_PREFIX}:${userId}`;
}

/** Mốc lần cuối người này xem phòng chat (ms). Chưa xem hoặc không đọc được storage thì null */
export function readChatLastSeenAt(userId: string): number | null {
  try {
    const savedValue = localStorage.getItem(getChatLastSeenStorageKey(userId));
    const lastSeenAt = Number(savedValue);

    return savedValue && Number.isFinite(lastSeenAt) ? lastSeenAt : null;
  } catch {
    return null;
  }
}

export function saveChatLastSeenAt(userId: string, lastSeenAt: number) {
  try {
    localStorage.setItem(getChatLastSeenStorageKey(userId), String(lastSeenAt));
  } catch {
    // Storage bị chặn: chấm tin mới có thể hiện lại, không ảnh hưởng gì khác
  }
}

/** Đã tắt bong bóng mời vào chat trong phiên này. Không đọc được storage thì coi như chưa */
export function isChatHostBubbleDismissed(): boolean {
  try {
    return (
      sessionStorage.getItem(CHAT_HOST_BUBBLE_DISMISSED_STORAGE_KEY) === "1"
    );
  } catch {
    return false;
  }
}

export function dismissChatHostBubble() {
  try {
    sessionStorage.setItem(CHAT_HOST_BUBBLE_DISMISSED_STORAGE_KEY, "1");
  } catch {
    // Storage bị chặn: chỉ ẩn tới khi tải lại trang
  }
}

/** Tin của hôm qua đã bị xoá lúc 00:00 nên không còn tính là tin mới */
export function getTodayLastMessageTime(
  lastMessageAt: string | null,
  now: number,
): number | null {
  if (!lastMessageAt) return null;

  const lastMessageTime = new Date(lastMessageAt).getTime();
  const todayStartTime = getVietnamStartOfDay(new Date(now)).getTime();

  return lastMessageTime >= todayStartTime ? lastMessageTime : null;
}

/** Có tin sau lần xem cuối. Chưa từng vào phòng thì tin nào hôm nay cũng là mới */
export function hasUnreadChat(
  lastMessageTime: number | null,
  lastSeenAt: number | null,
): boolean {
  if (lastMessageTime === null) return false;

  return lastSeenAt === null || lastMessageTime > lastSeenAt;
}

export function isChatLively(
  lastMessageTime: number | null,
  now: number,
): boolean {
  return (
    lastMessageTime !== null && now - lastMessageTime < CHAT_LIVELY_WINDOW_MS
  );
}

/** "vừa xong", "5 phút trước", "2 giờ trước". Tin chỉ sống trong ngày nên không cần tới ngày */
function formatMessageAge(lastMessageTime: number, now: number): string {
  const minutes = Math.floor((now - lastMessageTime) / 60_000);

  if (minutes < 1) return "vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;

  return `${Math.floor(minutes / 60)} giờ trước`;
}

/** "12 người trong phòng · tin mới 2 phút trước", dùng cho tooltip và screen reader */
export function describeChatActivity(
  onlineCount: number,
  lastMessageTime: number | null,
  now: number,
): string {
  const parts: string[] = [];

  if (onlineCount > 0) {
    parts.push(`${onlineCount} người trong phòng`);
  }

  if (lastMessageTime !== null) {
    parts.push(`tin mới ${formatMessageAge(lastMessageTime, now)}`);
  }

  return parts.join(" · ");
}
