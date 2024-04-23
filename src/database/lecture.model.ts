import { Schema } from "mongoose";

export interface ILecture extends Document {
  id: string;
  title: string;
  lesson: Schema.Types.ObjectId[];
  createdAt: string;
}
