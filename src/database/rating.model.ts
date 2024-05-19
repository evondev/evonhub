import { Schema, model, models } from "mongoose";

export interface IRating extends Document {
  user: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  rating: number;
  content: string;
  createdAt: Date;
}
const ratingSchema = new Schema<IRating>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  rating: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
    required: true,
  },
});
const Rating = models.Rating || model("Rating", ratingSchema);
export default Rating;
