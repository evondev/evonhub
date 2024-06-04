import mongoose, { Schema, models } from "mongoose";

export interface ILecture extends Document {
  id: string;
  title: string;
  lessons: Schema.Types.ObjectId[];
  courseId: Schema.Types.ObjectId;
  order: number;
  _destroy: boolean;
  createdAt: Date;
}
const lectureSchema = new Schema<ILecture>({
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
const Lecture = models.Lecture || mongoose.model("Lecture", lectureSchema);
export default Lecture;
