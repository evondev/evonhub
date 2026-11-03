import mongoose, { models, Schema } from "mongoose";
import { StudyDayModelProps } from "../types";

const studyDaySchema = new Schema<StudyDayModelProps>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  seconds: {
    type: Number,
    default: 0,
  },
});
// Cộng dồn vào đúng một dòng mỗi người mỗi ngày; cũng là index cho biểu đồ 7 ngày
studyDaySchema.index({ user: 1, day: 1 }, { unique: true });
// Bảng tuần, tháng: lọc theo khoảng ngày rồi gom theo người
studyDaySchema.index({ day: 1, user: 1 });
const StudyDayModel =
  models.StudyDay || mongoose.model("StudyDay", studyDaySchema);
export default StudyDayModel;
