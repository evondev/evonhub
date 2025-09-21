import { Document, Schema } from "mongoose";

export interface ScoreModelProps extends Document {
  _id: string;
  user: Schema.Types.ObjectId;
  score: number;
  _destroy: boolean;
}
