import { Schema } from "mongoose";
import { LessonItemData } from "./lesson.types";

export interface LectureModelProps extends Document {
  id: string;
  title: string;
  lessons: Schema.Types.ObjectId[];
  courseId: Schema.Types.ObjectId;
  order: number;
  _destroy: boolean;
  createdAt: Date;
}
export interface LectureItemData extends Omit<LectureModelProps, "lessons"> {
  _id: string;
  lessons: LessonItemData[];
}
