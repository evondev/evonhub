import { CommentStatus } from "@/shared/constants/comment.constants";
import { Schema } from "mongoose";

export interface IComment extends Document {
  _id: Schema.Types.ObjectId;
  parentId?: Schema.Types.ObjectId;
  content: string;
  user: Schema.Types.ObjectId;
  lesson: Schema.Types.ObjectId;
  status: CommentStatus;
  level: number;
  createdAt: Date;
}
// Dùng chung model của module. Hai schema cùng tên "Comment" thì file nào nạp
// trước thắng (hai schema như nhau), và index chỉ khai ở schema của module.
export { default } from "@/modules/comment/models";
