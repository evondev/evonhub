import mongoose, { models, Schema } from "mongoose";
import { LessonWatchModelProps } from "../types";

const lessonWatchSchema = new Schema<LessonWatchModelProps>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lesson: {
    type: Schema.Types.ObjectId,
    ref: "Lesson",
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  buckets: {
    type: [Number],
    default: [],
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
// Một người một dòng mỗi bài: xem lại đoạn cũ không cộng thêm
lessonWatchSchema.index({ user: 1, lesson: 1 }, { unique: true });
const LessonWatchModel =
  models.LessonWatch || mongoose.model("LessonWatch", lessonWatchSchema);
export default LessonWatchModel;
