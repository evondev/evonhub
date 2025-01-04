import { CourseItemData } from "@/modules/course/types";
import { Schema } from "mongoose";
import { LectureItemData } from "./lecture.types";

export interface LessonModelProps extends Document {
  _id: Schema.Types.ObjectId;
  title: string;
  slug: string;
  type: string;
  video: string;
  duration: number;
  content: string;
  status: string;
  order: number;
  courseId: Schema.Types.ObjectId;
  lectureId: Schema.Types.ObjectId;
  views: number;
  createdAt: Date;
  assetId: string;
  iframe: string;
  _destroy: boolean;
}
export interface LessonItemData
  extends Omit<LessonModelProps, "_id" | "lectureId" | "courseId"> {
  _id: string;
  courseId: string;
  lectureId: LectureItemData;
}
export interface LessonItemCutomizeData
  extends Omit<LessonModelProps, "_id" | "lectureId" | "courseId"> {
  _id: string;
  courseId: Omit<CourseItemData, "id"> & { _id: string };
}
export interface LessonDetailsOutlineData {
  id: string;
  title: string;
  lessons: LessonItemData[];
}
