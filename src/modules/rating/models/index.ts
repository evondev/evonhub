import { RatingStatus } from "@/shared/constants/rating.constants";
import { model, models, Schema } from "mongoose";
import { RatingModelProps } from "../types";

const ratingSchema = new Schema<RatingModelProps>({
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
    enum: Object.values(RatingStatus),
    default: RatingStatus.Inactive,
  },
});
ratingSchema.index({ clerkId: 1 }, { unique: true });
const RatingModel = models.Rating || model("Rating", ratingSchema);
export default RatingModel;
