import mongoose, { models, Schema } from "mongoose";
import {
  NOTIFICATION_TTL_SECONDS,
  NotificationType,
} from "../constants/notification-type.constants";
import { NotificationModelProps } from "../types";

const notificationSchema = new Schema<NotificationModelProps>({
  type: { type: String, enum: Object.values(NotificationType) },
  data: {
    type: new Schema(
      {
        courseTitle: String,
        courseSlug: String,
        lessonId: String,
        lessonTitle: String,
        commentId: String,
        parentCommentId: String,
        actorName: String,
      },
      { _id: false },
    ),
  },
  // Thông báo cũ chưa có type: câu ghép sẵn bằng HTML
  title: { type: String },
  content: { type: String },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

// chuông thông báo trên header
notificationSchema.index({ users: 1, createdAt: -1 });
// tự dọn thông báo cũ
notificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: NOTIFICATION_TTL_SECONDS },
);
const NotificationModel =
  models.Notification || mongoose.model("Notification", notificationSchema);

export default NotificationModel;
