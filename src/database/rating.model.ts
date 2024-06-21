import { ERatingStatus } from "@/types/enums";
import { Schema, model, models } from "mongoose";

export interface IRating extends Document {
  user: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  rating: number;
  content: string;
  createdAt: Date;
  status: ERatingStatus;
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
    default: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
  },
  status: {
    type: String,
    enum: Object.values(ERatingStatus),
    default: ERatingStatus.INACTIVE,
  },
});
const Rating = models.Rating || model("Rating", ratingSchema);
export default Rating;
