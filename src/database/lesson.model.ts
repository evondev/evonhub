import mongoose, { Schema, models } from "mongoose";

export interface ILesson extends Document {
  id: string;
  title: string;
  slug: string;
  type: string;
  video: string;
  duration: number;
  content: string;
  status: string;
  order: number;
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
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Lesson = models.Lesson || mongoose.model("Lesson", lessonSchema);
export default Lesson;
