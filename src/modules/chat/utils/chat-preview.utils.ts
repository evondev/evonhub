import { UserRole } from "@/shared/constants/user.constants";
import {
  chatPreviewMessageSeeds,
  chatPreviewSenders,
  chatPreviewVisitors,
} from "../constants";
import {
  ChatMessageView,
  ChatPreviewState,
  ChatSender,
  ChatViewer,
} from "../types";
import { toVietnamTimeToday } from "./chat-date.utils";

/** Tin giả của trang xem trước, giờ đặt vào hôm nay theo giờ Việt Nam */
export function buildPreviewMessages(now: Date = new Date()): ChatMessageView[] {
  return chatPreviewMessageSeeds.map((seed, index) => ({
    _id: `preview-message-${index}`,
    clientId: `preview-client-${index}`,
    sender: chatPreviewSenders[seed.senderKey],
    content: seed.content,
    createdAt: toVietnamTimeToday(seed.time, now).toISOString(),
    isPending: seed.isPending,
  }));
}

/** Người online giả: người đã nhắn trong phòng cộng thêm vài học viên chỉ ngồi xem */
export function buildPreviewOnlineMembers(): ChatSender[] {
  const visitors: ChatSender[] = chatPreviewVisitors.map((visitor, index) => ({
    userId: `preview-visitor-${index}`,
    name: visitor.name,
    username: `hocvien${index + 1}`,
    avatar: visitor.avatar,
    role: UserRole.User,
  }));

  return [...Object.values(chatPreviewSenders), ...visitors];
}

/** Người xem trang xem trước: học viên, riêng "Góc nhìn mod" là admin */
export function buildPreviewViewer(state: ChatPreviewState): ChatViewer {
  const isModeratorView = state === "mod";
  const sender = isModeratorView
    ? chatPreviewSenders.evon
    : chatPreviewSenders.me;

  return { ...sender, isModerator: isModeratorView };
}
