import { Document, Schema } from "mongoose";

export interface NotificationModelProps extends Document {
  _id: string;
  title: string;
  content: string;
  users: Schema.Types.ObjectId[];
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
}

export interface NotificationItemData
  extends Omit<NotificationModelProps, "users" | "createdBy"> {}

export interface SendNotificationParams {
  title: string;
  content: string;
  users?: string[];
  isSendAll?: boolean;
}

/** Một thông báo gửi riêng cho danh sách người nhận đã biết, dùng khi ghi nhiều thông báo một lần */
export interface NotificationDraft {
  title: string;
  content: string;
  users: string[];
}
