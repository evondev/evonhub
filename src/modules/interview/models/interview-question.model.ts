import mongoose, { models, Schema } from "mongoose";
import {
  InterviewDifficulty,
  InterviewQuestionOrigin,
  InterviewQuestionStatus,
  InterviewQuestionType,
} from "../constants/interview-enums";
import {
  InterviewOptionModelProps,
  InterviewQuestionModelProps,
  InterviewSourceModelProps,
} from "../types";

const optionSchema = new Schema<InterviewOptionModelProps>({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },
});

const sourceSchema = new Schema<InterviewSourceModelProps>(
  {
    url: { type: String, required: true },
    title: { type: String, default: "" },
    quote: { type: String, default: "" },
    isQuoteVerified: { type: Boolean, default: false },
  },
  { _id: false },
);

const interviewQuestionSchema = new Schema<InterviewQuestionModelProps>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(InterviewQuestionType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(InterviewQuestionStatus),
      default: InterviewQuestionStatus.Draft,
    },
    origin: {
      type: String,
      enum: Object.values(InterviewQuestionOrigin),
      default: InterviewQuestionOrigin.Manual,
    },
    difficulty: {
      type: String,
      enum: Object.values(InterviewDifficulty),
      default: InterviewDifficulty.Medium,
    },
    prompt: { type: String, required: true },
    code: { type: String, default: "" },
    options: { type: [optionSchema], default: [] },
    logItems: { type: [String], default: [] },
    explanation: { type: String, default: "" },
    keyPoints: { type: [String], default: [] },
    sources: { type: [sourceSchema], default: [] },
    version: { type: String, default: "" },
    tags: { type: [String], default: [] },
    sourcePages: { type: [String], default: [] },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    publishedAt: { type: Date },
  },
  { timestamps: true },
);
// Trang Admin: câu của một khoá theo trạng thái, mới nhất trước
interviewQuestionSchema.index({ course: 1, status: 1, createdAt: -1 });

const InterviewQuestionModel =
  models.InterviewQuestion ||
  mongoose.model("InterviewQuestion", interviewQuestionSchema);
export default InterviewQuestionModel;
