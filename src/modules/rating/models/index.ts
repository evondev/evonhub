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
// đánh giá của khóa ở trang chi tiết
ratingSchema.index({ course: 1, status: 1 });
// danh sách đánh giá công khai và trang quản lý
ratingSchema.index({ status: 1, createdAt: -1 });
const RatingModel = models.Rating || model("Rating", ratingSchema);
export default RatingModel;
