import { LectureModelProps } from "@/shared/types";
import mongoose, { models, Schema } from "mongoose";

const lectureSchema = new Schema<LectureModelProps>({
  title: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  lessons: [
    {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
    },
  ],
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
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
const LectureModel = models.Lecture || mongoose.model("Lecture", lectureSchema);
export default LectureModel;
