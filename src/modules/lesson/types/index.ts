import { Schema } from "mongoose";

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
export interface LessonItemData extends Omit<LessonModelProps, ""> {}
