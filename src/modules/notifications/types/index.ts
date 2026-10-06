import { Document, Schema } from "mongoose";
import { NotificationType } from "../constants/notification-type.constants";

/** Dữ liệu để dựng câu và link; loại nào dùng trường nào xem ở utils */
export interface NotificationPayload {
  courseTitle?: string;
  courseSlug?: string;
  lessonId?: string;
  lessonTitle?: string;
  commentId?: string;
  /** Trả lời bình luận: bình luận gốc của người nhận, và tên người trả lời */
  parentCommentId?: string;
  actorName?: string;
}

export interface NotificationModelProps extends Document {
  _id: string;
  type?: NotificationType;
  data?: NotificationPayload;
  /** Chỉ thông báo cũ (chưa có type) còn title, content dạng HTML */
  title?: string;
  content?: string;
  users: Schema.Types.ObjectId[];
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
}

export interface NotificationItemData {
  _id: string;
  type?: NotificationType;
  data?: NotificationPayload;
  title?: string;
  content?: string;
  createdAt: string;
}

export interface NotificationFeedData {
  notifications: NotificationItemData[];
  /** Mốc người dùng xem panel lần cuối; null là chưa xem lần nào */
  seenAt: string | null;
}

/** Các thông báo cùng loại, cùng đối tượng gộp thành một dòng; latest là cái mới nhất */
export interface NotificationGroup {
  key: string;
  latest: NotificationItemData;
  items: NotificationItemData[];
  isUnread: boolean;
}

export interface NotificationMessagePart {
  text: string;
  isHighlight?: boolean;
}

export interface SendNotificationParams {
  type: NotificationType;
  data: NotificationPayload;
  users?: string[];
  isSendAll?: boolean;
}

/** Một thông báo gửi riêng cho danh sách người nhận đã biết, dùng khi ghi nhiều thông báo một lần */
export interface NotificationDraft {
  type: NotificationType;
  data: NotificationPayload;
  users: string[];
}
