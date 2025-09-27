import { Schema } from "mongoose";

export interface BlogModelProps extends Document {
  _id: string;
  title: string;
  slug: string;
  content: string;
  author: Schema.Types.ObjectId;
  image: string;
  featured: boolean;
  _destroy: boolean;
}
