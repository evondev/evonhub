import { FilterTabItem } from "@/shared/types";
import { hasProfanity } from "@/shared/utils/profanity.utils";
import { formatUserLockUntil } from "@/shared/utils/user-lock.utils";
import dayjs from "dayjs";
import {
  SUPPORT_EMPTY_MESSAGE,
  SUPPORT_MESSAGE_MAX_LENGTH,
  SUPPORT_PREVIEW_MAX_LENGTH,
  SUPPORT_PROFANITY_MESSAGE,
  SUPPORT_TOO_LONG_MESSAGE,
  SUPPORT_UNANSWERED_LIMIT,
  supportInboxTabs,
} from "../constants";
import {
  SupportInboxFilter,
  SupportMessageItem,
  SupportUserSummary,
} from "../types";

/** Lỗi nội dung tin, null là gửi được. Client báo ngay, server kiểm lại */
export function getSupportContentError(content: string): string | null {
  const trimmedContent = content.trim();

  if (!trimmedContent) return SUPPORT_EMPTY_MESSAGE;
  if (trimmedContent.length > SUPPORT_MESSAGE_MAX_LENGTH) {
    return SUPPORT_TOO_LONG_MESSAGE;
  }
  if (hasProfanity(trimmedContent)) return SUPPORT_PROFANITY_MESSAGE;

  return null;
}

export function isSupportLimitReached(unansweredCount: number): boolean {
  return unansweredCount >= SUPPORT_UNANSWERED_LIMIT;
}

/** Dòng xem trước tin cuối trong hộp thư: gộp xuống dòng, cắt bớt */
export function toSupportPreview(content: string): string {
  const singleLineContent = content.replace(/\s+/g, " ").trim();

  if (singleLineContent.length <= SUPPORT_PREVIEW_MAX_LENGTH) {
    return singleLineContent;
  }

  return `${singleLineContent.slice(0, SUPPORT_PREVIEW_MAX_LENGTH - 1)}…`;
}

/** Hôm nay chỉ ghi giờ, ngày khác ghi thêm ngày tháng */
export function formatSupportMessageTime(
  createdAt: string,
  now: Date = new Date(),
): string {
  const createdTime = dayjs(createdAt);

  if (createdTime.isSame(now, "day")) return createdTime.format("HH:mm");
  if (createdTime.isSame(now, "year")) return createdTime.format("HH:mm DD/MM");

  return createdTime.format("HH:mm DD/MM/YYYY");
}

/** Nối tin vừa gửi vào cuối danh sách; tin đã có (Pusher về trước) thì bỏ qua */
export function appendSupportMessage(
  messages: SupportMessageItem[],
  message: SupportMessageItem,
): SupportMessageItem[] {
  if (messages.some((currentMessage) => currentMessage.id === message.id)) {
    return messages;
  }

  return [...messages, message];
}

/** Gắn số hội thoại chưa đọc vào tab "Chưa đọc" */
export function buildSupportInboxTabs(
  unreadCount?: number,
): FilterTabItem<SupportInboxFilter>[] {
  return supportInboxTabs.map((tab) => ({
    ...tab,
    count: tab.value === "unread" ? unreadCount : undefined,
  }));
}

/** Dòng xem trước trong hộp thư: tin của Admin ghi "Bạn: " ở đầu */
export function formatSupportPreview(
  lastMessagePreview: string,
  lastSenderIsAdmin: boolean,
): string {
  return lastSenderIsAdmin ? `Bạn: ${lastMessagePreview}` : lastMessagePreview;
}

/** Nhãn khoá trên đầu khung chat Admin; không bị khoá thì null */
export function getSupportUserLockLabel(
  user: SupportUserSummary,
): string | null {
  if (!user.isLocked) return null;

  const unlockAtLabel = formatUserLockUntil(user.lockedUntil);

  return unlockAtLabel ? `Bị khoá đến ${unlockAtLabel}` : "Bị khoá vĩnh viễn";
}
