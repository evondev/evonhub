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
