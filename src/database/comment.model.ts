import { TStatus } from "@/types";
import mongoose, { Schema, models } from "mongoose";

export interface IComment extends Document {
  _id: Schema.Types.ObjectId;
  content: string;
  user: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  lesson: Schema.Types.ObjectId;
  reply: Schema.Types.ObjectId[];
  status: TStatus;
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
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  lesson: {
    type: Schema.Types.ObjectId,
    ref: "Lesson",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  reply: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Comment = models.Comment || mongoose.model("Comment", commentSchema);
export default Comment;
