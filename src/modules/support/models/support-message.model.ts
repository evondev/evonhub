import { model, models, Schema } from "mongoose";
import { SUPPORT_MESSAGE_MAX_LENGTH } from "../constants";
import { SupportMessageModelProps } from "../types";

// Tin hỗ trợ giữ lâu dài, không tự xoá lúc nửa đêm như phòng chat chung
const supportMessageSchema = new Schema<SupportMessageModelProps>({
  conversation: {
    type: Schema.Types.ObjectId,
    ref: "SupportConversation",
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isFromAdmin: {
    type: Boolean,
    default: false,
  },
  content: {
    type: String,
    required: true,
    maxlength: SUPPORT_MESSAGE_MAX_LENGTH,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

supportMessageSchema.index({ conversation: 1, createdAt: -1 });
// Rate limit: tìm tin gần nhất của một người
supportMessageSchema.index({ sender: 1, createdAt: -1 });

const SupportMessageModel =
  models.SupportMessage ||
  model<SupportMessageModelProps>("SupportMessage", supportMessageSchema);

export default SupportMessageModel;
