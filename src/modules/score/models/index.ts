import { ScoreModelProps } from "@/shared/types/score.types";
import { model, models, Schema } from "mongoose";

const scoreSchema = new Schema<ScoreModelProps>({
  score: {
    type: Number,
    required: true,
    default: 0,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  _destroy: {
    type: Boolean,
    default: false,
  },
});
const ScoreModel = models.Score || model("Score", scoreSchema);
export default ScoreModel;
