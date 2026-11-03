import mongoose, { models, Schema } from "mongoose";
import { StudyTotalModelProps } from "../types";

const studyTotalSchema = new Schema<StudyTotalModelProps>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  seconds: {
    type: Number,
    default: 0,
  },
  lastCreditAt: {
    type: Date,
  },
});
studyTotalSchema.index({ user: 1 }, { unique: true });
// Bảng "Tất cả": sắp theo tổng giây, không phải gom cả lịch sử theo ngày
studyTotalSchema.index({ seconds: -1 });
const StudyTotalModel =
  models.StudyTotal || mongoose.model("StudyTotal", studyTotalSchema);
export default StudyTotalModel;
