import { Document, Schema } from "mongoose";

export interface IHistory extends Document {
  user: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  lesson: Schema.Types.ObjectId;
  createdAt: Date;
}
// Dùng chung model của module. Hai schema cùng tên "History" thì file nào nạp
// trước thắng (hai schema như nhau), và index chỉ khai ở schema của module.
export { default } from "@/shared/models/history.model";
