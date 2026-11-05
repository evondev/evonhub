import mongoose, { models, Schema } from "mongoose";
import { StudySessionModelProps } from "../types";

// Đã giữ chỗ hai ngày là đủ: qua ngày mới thì khóa chống đếm trùng (day) đã khác
const STUDY_SESSION_TTL_SECONDS = 2 * 24 * 60 * 60;

/**
 * Đánh dấu một người đã được tính lượt học của một khóa trong một ngày, để vào
 * lại bài khác, tải lại trang trong ngày không cộng thêm lượt
 */
const studySessionSchema = new Schema<StudySessionModelProps>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  // Ngày theo giờ Việt Nam, dạng YYYY-MM-DD
  day: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: STUDY_SESSION_TTL_SECONDS,
  },
});
// Unique để hai request cùng lúc không cùng cộng lượt
studySessionSchema.index({ course: 1, user: 1, day: 1 }, { unique: true });

const StudySessionModel =
  models.StudySession || mongoose.model("StudySession", studySessionSchema);
export default StudySessionModel;
