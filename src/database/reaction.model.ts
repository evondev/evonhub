import { EReactionType } from "@/types/enums";
import mongoose, { Schema, models } from "mongoose";

export interface IReaction extends Document {
  type: EReactionType;
  lessonId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  createdAt: Date;
}
const reactionSchema = new Schema<IReaction>({
  type: {
    type: String,
    required: true,
    enum: [
      EReactionType.AWESOME,
      EReactionType.BAD,
      EReactionType.GOOD,
      EReactionType.MEH,
      EReactionType.TERRIBLE,
    ],
  },
  lessonId: {
    type: Schema.Types.ObjectId,
    ref: "Lesson",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Reaction = models.Reaction || mongoose.model("Reaction", reactionSchema);
export default Reaction;
