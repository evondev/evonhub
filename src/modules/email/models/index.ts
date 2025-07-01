import { EmailModelProps, EmailStatus } from "@/shared/types/email.types";
import mongoose, { models, Schema } from "mongoose";

const emailSchema = new Schema<EmailModelProps>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  recipients: {
    type: [String],
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(EmailStatus),
    default: EmailStatus.Success,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  count: {
    type: Number,
    default: 0,
  },
});
const EmailModel = models.Email || mongoose.model("Email", emailSchema);
export default EmailModel;
