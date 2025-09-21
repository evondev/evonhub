import { Document, Schema } from "mongoose";
import { UserItemData } from "./user.types";

export interface ScoreModelProps extends Document {
  _id: string;
  user: Schema.Types.ObjectId;
  score: number;
  _destroy: boolean;
}

export interface ScoreItemData extends Omit<ScoreModelProps, "user"> {
  user: UserItemData;
}
