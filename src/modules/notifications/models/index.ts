import mongoose, { models, Schema } from "mongoose";
import { NotificationModelProps } from "../types";

const notificationSchema = new Schema<NotificationModelProps>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const NotificationModel =
  models.Notification || mongoose.model("Notification", notificationSchema);

export default NotificationModel;
