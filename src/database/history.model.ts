import { Document, Schema, model, models } from "mongoose";

export interface IHistory extends Document {
  user: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  lesson: Schema.Types.ObjectId;
  createdAt: Date;
}
const historySchema = new Schema<IHistory>({
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
const History = models.History || model("History", historySchema);
export default History;
