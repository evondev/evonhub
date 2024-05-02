import mongoose, { Schema, models } from "mongoose";

export interface ILecture extends Document {
  id: string;
  title: string;
  lesson: Schema.Types.ObjectId[];
  order: number;
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
  lesson: [
    {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Lecture = models.Lecture || mongoose.model("Lecture", lectureSchema);
export default Lecture;
