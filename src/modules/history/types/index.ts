import { CourseItemData } from "@/modules/course/types";
import { UserItemData } from "@/modules/user/types";
import { LessonItemData } from "@/shared/types";
import { Schema } from "mongoose";

export interface HistoryModelProps extends Document {
  user: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  lesson: Schema.Types.ObjectId;
  createdAt: Date;
}
export interface HistoryItemData
  extends Omit<HistoryModelProps, "user" | "lesson" | "course"> {
  course: CourseItemData;
  user: UserItemData;
  lesson: LessonItemData;
}
