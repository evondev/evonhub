import { MicroStatus } from "@/shared/constants/micro.constant";
import mongoose, { models, Schema } from "mongoose";
import { MicroModelProps } from "../types";

const microSchema = new Schema<MicroModelProps>({
  title: {
    type: String,
  },
  slug: {
    type: String,
  },
  content: {
    type: String,
  },
  rating: {
    type: [Number],
    // Chỉ chứa sao của đánh giá đã duyệt (handleRatingStatus); khóa mới chưa có
    default: [],
  },
  image: {
    type: String,
    default: "/default.jpg",
  },
  video: {
    type: String,
  },
  duration: {
    type: String,
  },
  status: {
    type: String,
    enum: Object.values(MicroStatus),
    default: MicroStatus.Pending,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  seoKeywords: {
    type: String,
  },
  _destroy: {
    type: Boolean,
    default: false,
  },
});
const MicroModel = models.Micro || mongoose.model("Micro", microSchema);
export default MicroModel;
