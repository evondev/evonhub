import { CommentStatus } from "@/shared/constants/comment.constants";
import { LessonItemData } from "@/shared/types";
import { UserItemData } from "@/shared/types/user.types";
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
  extends Omit<CommentModelProps, "user" | "lesson" | "parentId" | "_id"> {
  _id: string;
  parentId?: string;
  user: UserItemData;
  lesson: Omit<LessonItemData, "courseId"> & {
    courseId: {
      slug: string;
      title: string;
    };
  };
}

export interface FetchCommentsProps {
  userId: string;
  status?: CommentStatus;
  page: number;
  limit: number;
  search?: string;
}

export interface UpdateCommentProps {
  commentId: string;
  status: CommentStatus;
  userId?: string;
}
