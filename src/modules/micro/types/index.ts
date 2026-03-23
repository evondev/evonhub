import { MicroStatus } from "@/shared/constants/micro.constant";
import mongoose, { Document, Schema } from "mongoose";

mongoose.Promise = global.Promise;

export interface MicroModelProps extends Document {
  id: string;
  title: string;
  slug: string;
  content: string;
  video: string;
  duration: string;
  rating: number[];
  image: string;
  status: MicroStatus;
  author: Schema.Types.ObjectId;
  views: number;
  createdAt: Date;
  seoKeywords: string;
  _destroy: boolean;
}

export interface MicroItemData extends Omit<MicroModelProps, "id"> {
  _id: string;
}
export interface FetchMicroParams {
  status: MicroStatus;
}
