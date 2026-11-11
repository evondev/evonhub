import { model, models, Schema } from "mongoose";
import { SupportConversationModelProps } from "../types";

const supportConversationSchema = new Schema<SupportConversationModelProps>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
  lastMessagePreview: {
    type: String,
    default: "",
  },
  lastSenderIsAdmin: {
    type: Boolean,
    default: false,
  },
  isUnreadByAdmin: {
    type: Boolean,
    default: false,
  },
  unansweredCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

supportConversationSchema.index({ user: 1 }, { unique: true });
// Hộp thư: mới nhất lên đầu, tab "Chưa đọc" lọc thêm cờ
supportConversationSchema.index({ lastMessageAt: -1 });
supportConversationSchema.index({ isUnreadByAdmin: 1, lastMessageAt: -1 });

const SupportConversationModel =
  models.SupportConversation ||
  model<SupportConversationModelProps>(
    "SupportConversation",
    supportConversationSchema,
  );

export default SupportConversationModel;
