import { ECommentStatus } from "@/types/enums";
import mongoose, { Schema, models } from "mongoose";

export interface IComment extends Document {
  _id: Schema.Types.ObjectId;
  parentId?: Schema.Types.ObjectId;
  content: string;
  user: Schema.Types.ObjectId;
  lesson: Schema.Types.ObjectId;
  status: ECommentStatus;
  level: number;
  createdAt: Date;
}
const commentSchema = new Schema<IComment>({
  content: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  lesson: {
    type: Schema.Types.ObjectId,
    ref: "Lesson",
  },
  status: {
    type: String,
    enum: [
      ECommentStatus.PENDING,
      ECommentStatus.APPROVED,
      ECommentStatus.REJECTED,
    ],
    default: ECommentStatus.PENDING,
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
  level: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Comment = models.Comment || mongoose.model("Comment", commentSchema);
export default Comment;
