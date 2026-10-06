import { UserRole } from "@/shared/constants/user.constants";
import { model, models, Schema } from "mongoose";
import { CHAT_MESSAGE_MAX_LENGTH } from "../constants";
import { ChatMessageModelProps } from "../types";

const chatMessageSchema = new Schema<ChatMessageModelProps>({
  clientId: {
    type: String,
    required: true,
  },
  sender: {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      default: "",
    },
    username: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.User,
    },
  },
  content: {
    type: String,
    required: true,
    maxlength: CHAT_MESSAGE_MAX_LENGTH,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Mongo tự xoá khi tới mốc này (00:00 giờ VN hôm sau). Tiến trình TTL quét
  // khoảng 60 giây một lần nên query vẫn phải lọc theo đầu ngày
  expireAt: {
    type: Date,
    required: true,
  },
});

chatMessageSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
chatMessageSchema.index({ createdAt: -1 });
// Rate limit: tìm tin gần nhất của một người
chatMessageSchema.index({ "sender.user": 1, createdAt: -1 });

const ChatMessageModel =
  models.ChatMessage ||
  model<ChatMessageModelProps>("ChatMessage", chatMessageSchema);

export default ChatMessageModel;
