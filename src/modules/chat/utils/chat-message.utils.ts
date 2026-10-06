import {
  CHAT_EMPTY_MESSAGE,
  CHAT_GROUP_WINDOW_MS,
  CHAT_MESSAGE_MAX_LENGTH,
  CHAT_PROFANITY_MESSAGE,
  CHAT_TOO_LONG_MESSAGE,
} from "../constants";
import { ChatMessageItem, ChatMessageView } from "../types";
import { hasProfanity } from "./profanity.utils";

/** Lỗi nội dung tin, null là gửi được. Client báo ngay, server kiểm lại */
export function getChatContentError(content: string): string | null {
  const trimmedContent = content.trim();

  if (!trimmedContent) return CHAT_EMPTY_MESSAGE;
  if (trimmedContent.length > CHAT_MESSAGE_MAX_LENGTH) {
    return CHAT_TOO_LONG_MESSAGE;
  }
  if (hasProfanity(trimmedContent)) return CHAT_PROFANITY_MESSAGE;

  return null;
}

/** Tin nối tiếp tin trước của cùng người trong 5 phút: ẩn avatar và tên */
export function isContinuationMessage(
  previousMessage: ChatMessageItem | undefined,
  message: ChatMessageItem,
): boolean {
  if (!previousMessage) return false;
  if (previousMessage.sender.userId !== message.sender.userId) return false;

  const gap =
    new Date(message.createdAt).getTime() -
    new Date(previousMessage.createdAt).getTime();

  return gap >= 0 && gap < CHAT_GROUP_WINDOW_MS;
}

/**
 * Thêm tin từ server/Pusher vào danh sách. Trùng clientId là tin mình vừa gửi
 * (hoặc tin đã có) thì thay tại chỗ, không hiện hai lần.
 */
export function mergeIncomingMessages(
  messages: ChatMessageView[],
  incomingMessages: ChatMessageItem[],
): ChatMessageView[] {
  if (incomingMessages.length === 0) return messages;

  const nextMessages = [...messages];
  const positionByClientId = new Map(
    nextMessages.map((message, index) => [message.clientId, index]),
  );

  for (const incomingMessage of incomingMessages) {
    const existingIndex = positionByClientId.get(incomingMessage.clientId);

    if (existingIndex !== undefined) {
      nextMessages[existingIndex] = incomingMessage;
      continue;
    }

    positionByClientId.set(incomingMessage.clientId, nextMessages.length);
    nextMessages.push(incomingMessage);
  }

  return nextMessages;
}

/** _id tin mới nhất đã qua server, làm mốc lấy bù tin bị lỡ */
export function getLatestConfirmedMessageId(
  messages: ChatMessageView[],
): string | undefined {
  for (let index = messages.length - 1; index >= 0; index--) {
    if (!messages[index].isPending) return messages[index]._id;
  }

  return undefined;
}

/** randomUUID chỉ có trên https/localhost; mở dev qua IP LAN thì dùng chuỗi ngẫu nhiên */
export function createClientId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
