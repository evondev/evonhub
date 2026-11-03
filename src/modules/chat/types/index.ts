import { UserRole } from "@/shared/constants/user.constants";
import { MenuLinkSignal } from "@/shared/types";
import { Types } from "mongoose";

/** Người gửi chép thẳng vào tin: tin chỉ sống trong ngày nên không cần populate */
export interface ChatSender {
  userId: string;
  name: string;
  username: string;
  avatar: string;
  /** Hiện huy hiệu Giảng viên / Admin cạnh tên. Tin cũ chưa có thì coi là học viên */
  role?: UserRole;
}

export interface ChatMessageModelProps {
  _id: Types.ObjectId;
  clientId: string;
  sender: {
    user: Types.ObjectId;
    name: string;
    username: string;
    avatar: string;
    role?: UserRole;
  };
  content: string;
  createdAt: Date;
  expireAt: Date;
}

/** Tin đã qua server, gửi xuống client và qua Pusher */
export interface ChatMessageItem {
  _id: string;
  clientId: string;
  sender: ChatSender;
  content: string;
  createdAt: string;
}

/** Tin trên màn hình: tin mình vừa gửi hiện ngay khi server chưa trả về */
export interface ChatMessageView extends ChatMessageItem {
  isPending?: boolean;
}

/** Người đang xem trang chat, server đọc từ session rồi truyền xuống */
export interface ChatViewer extends ChatSender {
  isModerator: boolean;
}

export interface FetchChatMessagesParams {
  /** _id của tin cũ nhất đang có: lấy trang tin cũ hơn */
  before?: string;
  /** _id của tin mới nhất đang có: lấy các tin bị lỡ khi mất kết nối */
  after?: string;
}

export interface FetchChatMessagesResult {
  messages: ChatMessageItem[];
  hasMore: boolean;
}

export interface SendChatMessageParams {
  clientId: string;
  content: string;
}

export interface SendChatMessageResult {
  message?: ChatMessageItem;
  error?: string;
}

export interface DeleteChatMessageResult {
  isDeleted: boolean;
  error?: string;
}

export interface ChatMessageDeletedPayload {
  messageId: string;
}

/** Admin đang ở trong phòng, hiện trên bong bóng mời vào chat */
export interface ChatHost {
  name: string;
  avatar: string;
}

/** Ai đang ở trong phòng chat theo Pusher */
export interface ChatPresence {
  /** Số người đang mở trang chat, không phải số người đang vào web */
  onlineCount: number;
  /** Một admin đang trong phòng, null khi không có ai */
  host: ChatHost | null;
}

/** Tình hình phòng chat cho mục Trò chuyện trên menu và bong bóng mời vào chat */
export interface ChatActivity extends ChatPresence {
  /** Giờ tin mới nhất hôm nay, null khi hôm nay chưa ai nhắn */
  lastMessageAt: string | null;
}

/** Kết quả của useChatActivity */
export interface ChatActivityState {
  /** Tín hiệu cho mục Trò chuyện, null khi không có gì để báo */
  menuSignal: MenuLinkSignal | null;
  /** Admin đang trong phòng; null khi không có, hoặc khi đang ở trang chat */
  host: ChatHost | null;
}

/** Gửi qua kênh chat-activity mỗi khi có tin mới */
export interface ChatActivityEventPayload {
  lastMessageAt: string;
}

/** Pusher HTTP API GET /channels/:name/users, chỉ có với presence channel */
export interface PusherChannelUsers {
  users: { id: string }[];
}

export interface UseChatActivityParams {
  /** Rỗng là khách: vẫn thấy số người trong phòng, không có chấm tin mới */
  userId: string;
  isOnChatPage: boolean;
  isEnabled: boolean;
}

/** Thành viên presence channel của Pusher: id + user_info gửi từ /api/pusher/auth */
export interface PusherPresenceMember {
  id: string;
  info: Omit<ChatSender, "userId">;
}

export interface UseChatChannelHandlers {
  onMessage: (message: ChatMessageItem) => void;
  onMessageDeleted: (messageId: string) => void;
  /** Vừa vào kênh hoặc nối lại sau khi rớt mạng: lấy bù tin bị lỡ */
  onSync: () => void;
}

export interface UseChatMessagesParams {
  viewer: ChatViewer;
  initialMessages: ChatMessageItem[];
  initialHasMore: boolean;
}

/** Danh sách tin và chỉ số đầu của Virtuoso luôn đổi cùng nhau khi chèn tin cũ */
export interface ChatFeedState {
  messages: ChatMessageView[];
  firstItemIndex: number;
  hasMore: boolean;
}

/** Dữ liệu Virtuoso chuyển cho Header của danh sách */
export interface ChatMessageListContext {
  hasMore: boolean;
  isLoadingOlder: boolean;
}

export type ChatPreviewState =
  "du-lieu" | "tin-moi" | "chan" | "mod" | "dang-tai" | "rong" | "loi";

export interface ChatPreviewStateLink {
  state: ChatPreviewState;
  label: string;
}

export interface ChatPreviewVisitor {
  name: string;
  avatar: string;
}

/** Người online chia hai nhóm: giảng viên, admin đứng trước học viên */
export interface ChatOnlineGroups {
  staffMembers: ChatSender[];
  learnerMembers: ChatSender[];
}

/** Tin giả cho trang xem trước: giờ theo giờ Việt Nam hôm nay */
export interface ChatPreviewMessageSeed {
  time: string;
  senderKey: string;
  content: string;
  isPending?: boolean;
}

export interface ChatMessageSegment {
  type: "text" | "link";
  value: string;
  /** Chỉ có ở link: địa chỉ đã kiểm tra là http/https */
  href?: string;
}

export interface ChatEmoji {
  symbol: string;
  label: string;
}
