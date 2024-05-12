import mongoose, { Schema, models } from "mongoose";

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
}
const lessonSchema = new Schema<ILesson>({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "video",
  },
  video: {
    type: String,
    default: "",
  },
  duration: {
    type: Number,
    default: 0,
  },
  content: {
    type: String,
  },
  status: {
    type: String,
    default: "draft",
  },
  order: {
    type: Number,
    default: 0,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  lectureId: {
    type: Schema.Types.ObjectId,
    ref: "Lecture",
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Lesson = models.Lesson || mongoose.model("Lesson", lessonSchema);
export default Lesson;
