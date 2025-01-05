import { CommentStatus } from "@/shared/constants/comment.constants";
import mongoose, { models, Schema } from "mongoose";
import { CommentModelProps } from "../types";

const commentSchema = new Schema<CommentModelProps>({
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
      CommentStatus.Pending,
      CommentStatus.Approved,
      CommentStatus.Rejected,
    ],
    default: CommentStatus.Pending,
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
const CommentModel = models.Comment || mongoose.model("Comment", commentSchema);
export default CommentModel;
