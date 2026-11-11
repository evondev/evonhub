import { UserLock } from "@/shared/types/user.types";
import { Document, Types } from "mongoose";

/** Mỗi học viên có đúng một hội thoại với Admin */
export interface SupportConversationModelProps extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  lastMessageAt: Date;
  lastMessagePreview: string;
  lastSenderIsAdmin: boolean;
  /** Học viên gửi thì bật, Admin mở hội thoại thì tắt */
  isUnreadByAdmin: boolean;
  /** Số tin học viên gửi liền nhau chưa được Admin đáp */
  unansweredCount: number;
  createdAt: Date;
}

export interface SupportMessageModelProps extends Document {
  _id: Types.ObjectId;
  conversation: Types.ObjectId;
  sender: Types.ObjectId;
  isFromAdmin: boolean;
  content: string;
  createdAt: Date;
}

export interface SupportMessageItem {
  id: string;
  isFromAdmin: boolean;
  content: string;
  createdAt: string;
}

/** Người nhắn, đủ cho hộp thư và đầu khung chat phía Admin */
export interface SupportUserSummary {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  isLocked: boolean;
  /** Hạn mở khoá (ISO); null là khoá vĩnh viễn hoặc không bị khoá */
  lockedUntil: string | null;
}

export interface SupportConversationItem {
  id: string;
  user: SupportUserSummary;
  lastMessageAt: string;
  lastMessagePreview: string;
  lastSenderIsAdmin: boolean;
  isUnreadByAdmin: boolean;
}

/** Hội thoại của chính học viên đang đăng nhập */
export interface MySupportThread {
  messages: SupportMessageItem[];
  /** Đã gửi đủ số tin chưa được đáp, khoá ô nhập */
  isLimitReached: boolean;
}

export interface SupportInbox {
  conversations: SupportConversationItem[];
  unreadCount: number;
}

export interface SupportConversationThread {
  conversation: SupportConversationItem;
  messages: SupportMessageItem[];
}

export type SupportInboxFilter = "all" | "unread";

export interface SendSupportMessageResult {
  message?: SupportMessageItem;
  isLimitReached?: boolean;
  error?: string;
}

export interface ReplySupportMessageParams {
  conversationId: string;
  content: string;
}

export interface ReplySupportMessageResult {
  message?: SupportMessageItem;
  error?: string;
}

/** Bản ghi user đã populate vào hội thoại */
export interface SupportPopulatedUser {
  _id: Types.ObjectId;
  name?: string;
  username?: string;
  email?: string;
  avatar?: string;
  status?: string;
  lock?: UserLock;
}

export interface SupportPopulatedConversation extends Omit<
  SupportConversationModelProps,
  "user"
> {
  user: SupportPopulatedUser | null;
}
