import { LessonItemData } from "@/shared/types";
import { Schema } from "mongoose";
import { CourseItemData } from "./course.types";
import { UserItemData } from "./user.types";

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
