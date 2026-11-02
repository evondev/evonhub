import { ActivityType } from "@/shared/constants/activity.constants";
import mongoose, { models, Schema } from "mongoose";
import { ACTIVITY_RETENTION_DAYS } from "../constants";
import { ActivityModelProps } from "../types";

const activitySchema = new Schema<ActivityModelProps>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: Object.values(ActivityType),
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  lesson: {
    type: Schema.Types.ObjectId,
    ref: "Lesson",
  },
  targetTitle: {
    type: String,
  },
  detail: {
    type: String,
  },
  lastSeenAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
// Mongo tự xoá dòng cũ hơn ACTIVITY_RETENTION_DAYS
activitySchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: ACTIVITY_RETENTION_DAYS * 24 * 60 * 60 },
);
// Trang admin: mới nhất trước, lọc theo người hoặc theo khoá
activitySchema.index({ lastSeenAt: -1 });
activitySchema.index({ user: 1, lastSeenAt: -1 });
activitySchema.index({ course: 1, lastSeenAt: -1 });
// Tab theo nhóm việc
activitySchema.index({ type: 1, lastSeenAt: -1 });
// Nối phiên: tìm dòng gần nhất của cùng người, cùng việc
activitySchema.index({ user: 1, type: 1, lastSeenAt: -1 });
const ActivityModel =
  models.Activity || mongoose.model("Activity", activitySchema);
export default ActivityModel;
