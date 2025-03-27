import { EmailModelProps } from "@/shared/types/email.types";
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const EmailModel = models.Email || mongoose.model("Email", emailSchema);
export default EmailModel;
