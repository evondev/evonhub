import { Schema } from "mongoose";

export interface ILesson extends Document {
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
  trial?: boolean;
}
// Dùng chung model của module lesson. Hai schema cùng tên "Lesson" thì file nào nạp
// trước thắng; schema cũ ở đây thiếu trial, nạp trước là bài học thử mất cờ khi lưu.
export { default } from "@/modules/lesson/models";
