import mongoose, { models, Schema } from "mongoose";
import { HistoryModelProps } from "../types/history.types";

const historySchema = new Schema<HistoryModelProps>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  lesson: {
    type: Schema.Types.ObjectId,
    ref: "Lesson",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const HistoryModel = models.History || mongoose.model("History", historySchema);
export default HistoryModel;
