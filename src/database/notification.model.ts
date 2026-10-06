import { Schema } from "mongoose";

export interface INotification extends Document {
  _id: string;
  title: string;
  content: string;
  users: Schema.Types.ObjectId[];
  createdBy: string;
  createdAt: Date;
}
// Dùng chung model của module. Hai schema cùng tên "Notification" thì file nào nạp
// trước thắng (hai schema như nhau), và index chỉ khai ở schema của module.
export { default } from "@/modules/notifications/models";
