import mongoose, { models, Schema } from "mongoose";
import { LessonModelProps } from "../types";

const lessonSchema = new Schema<LessonModelProps>({
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
  assetId: {
    type: String,
  },
  iframe: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  _destroy: {
    type: Boolean,
    default: false,
  },
});
const LessonModel = models.Lesson || mongoose.model("Lesson", lessonSchema);
export default LessonModel;
