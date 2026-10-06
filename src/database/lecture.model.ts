import { Schema } from "mongoose";

export interface ILecture extends Document {
  id: string;
  title: string;
  lessons: Schema.Types.ObjectId[];
  courseId: Schema.Types.ObjectId;
  order: number;
  _destroy: boolean;
  createdAt: Date;
}
// Dùng chung model của module. Hai schema cùng tên "Lecture" thì file nào nạp
// trước thắng (hai schema như nhau), và index chỉ khai ở schema của module.
export { default } from "@/modules/lecture/models";
