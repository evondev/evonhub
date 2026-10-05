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
export interface RatingItemData extends Omit<
  RatingModelProps,
  "course" | "user"
> {
  _id: string;
  course: CourseItemData;
  user: UserItemData;
}

export interface FetchRatingManageProps {
  limit: number;
  page: number;
  status?: RatingStatus;
  /** Chỉ lấy đánh giá đúng số sao này */
  rating?: number;
  /** Chỉ lấy đánh giá của các khoá có slug này */
  courseSlugs?: string[];
}

export interface HandleRatingStatusProps {
  ratingId: string;
  status: RatingStatus;
}

export interface HandleRatingStatusResult {
  isSuccess: boolean;
  message?: string;
}
