import mongoose, { models, Schema } from "mongoose";
import { InterviewAttemptModelProps } from "../types";

const interviewAttemptSchema = new Schema<InterviewAttemptModelProps>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  question: {
    type: Schema.Types.ObjectId,
    ref: "InterviewQuestion",
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  selectedOptionId: { type: String },
  logOrder: { type: [Number], default: undefined },
  isCorrect: { type: Boolean, default: false },
  isFirstAttempt: { type: Boolean, default: false },
  points: { type: Number, default: 0 },
  explanationText: { type: String, default: "" },
  coveredKeyPoints: { type: [Number], default: [] },
  createdAt: { type: Date, default: Date.now },
});
// Mỗi người chỉ một lượt đầu mỗi câu: hai lần nộp cùng lúc thì lần sau không được tính điểm
interviewAttemptSchema.index(
  { user: 1, question: 1 },
  { unique: true, partialFilterExpression: { isFirstAttempt: true } },
);
// Thống kê từng câu ở trang Admin, xoá lượt làm khi xoá câu
interviewAttemptSchema.index({ question: 1, isFirstAttempt: 1 });
// Tiến độ của một người trong một khoá
interviewAttemptSchema.index({ user: 1, course: 1, createdAt: -1 });

const InterviewAttemptModel =
  models.InterviewAttempt ||
  mongoose.model("InterviewAttempt", interviewAttemptSchema);
export default InterviewAttemptModel;
