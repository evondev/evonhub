import mongoose, { models, Schema } from "mongoose";
import { FeedbackModelProps } from "../types";

const feedbackSchema = new Schema<FeedbackModelProps>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseWish: {
    type: String,
    default: "",
  },
  featureWish: {
    type: String,
    default: "",
  },
  // Không đặt default: góp ý cũ và người bỏ qua câu này đều là "không trả lời"
  wantsEnglish: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
// Trang admin: mới nhất trước
feedbackSchema.index({ createdAt: -1 });
// Đã góp ý chưa, đếm số góp ý trong ngày của một người
feedbackSchema.index({ user: 1, createdAt: -1 });
const FeedbackModel =
  models.Feedback || mongoose.model("Feedback", feedbackSchema);
export default FeedbackModel;
