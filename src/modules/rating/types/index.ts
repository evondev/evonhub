import { CourseItemData } from "@/modules/course/types";
import { RatingStatus } from "@/shared/constants/rating.constants";
import { UserItemData } from "@/shared/types/user.types";
import { Document, Schema } from "mongoose";

export interface RatingModelProps extends Document {
  user: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  rating: number;
  content: string;
  createdAt: Date;
  status: RatingStatus;
}
export interface RatingItemData
  extends Omit<RatingModelProps, "courses" | "user"> {
  courses: CourseItemData[];
  user: UserItemData;
}
