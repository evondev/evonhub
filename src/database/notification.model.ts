import mongoose, { Schema, models } from "mongoose";

export interface INotification extends Document {
  _id: string;
  title: string;
  content: string;
  users: Schema.Types.ObjectId[];
  createdBy: string;
  createdAt: Date;
}
const notificationSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});
const Notification =
  models.Notification || mongoose.model("Notification", notificationSchema);
export default Notification;
