import { UserItemData } from "@/modules/user/types";
import { CommentStatus } from "@/shared/constants/comment.constants";
import { LessonItemData } from "@/shared/types";
import { Schema } from "mongoose";

export interface CommentModelProps extends Document {
  _id: Schema.Types.ObjectId;
  parentId?: Schema.Types.ObjectId;
  content: string;
  user: Schema.Types.ObjectId;
  lesson: Schema.Types.ObjectId;
  status: CommentStatus;
  level: number;
  createdAt: Date;
}
export interface CommentItemData
  extends Omit<CommentModelProps, "user" | "lesson" | "parentId"> {
  parentId?: string;
  user: UserItemData;
  lesson: LessonItemData;
}
