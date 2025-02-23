import {
  CourseLabel,
  CourseLevel,
  CourseStatus,
} from "@/shared/constants/course.constants";
import { LectureItemData } from "@/shared/types";
import mongoose, { Document, Schema } from "mongoose";

mongoose.Promise = global.Promise;

export interface CourseModelProps extends Document {
  id: string;
  title: string;
  slug: string;
  price: number;
  salePrice: number;
  desc: string;
  content: string;
  rating: number[];
  image: string;
  intro: string;
  status: CourseStatus;
  level: CourseLevel;
  category: Schema.Types.ObjectId;
  label: CourseLabel;
  info: {
    requirements: string[];
    gained: string[];
    qa: {
      question: string;
      answer: string;
    }[];
  };
  review: Schema.Types.ObjectId[];
  lecture: Schema.Types.ObjectId[];
  author: Schema.Types.ObjectId;
  views: number;
  cta: string;
  ctaLink: string;
  createdAt: Date;
  seoKeywords: string;
  minPrice?: number;
  free: boolean;
  isPackage: boolean;
  _destroy: boolean;
}

export interface CourseItemData
  extends Omit<CourseModelProps, "id" | "lecture"> {
  _id: string;
  lecture: LectureItemData[];
}
export interface FetchCoursesParams {
  status: CourseStatus;
}

export interface FetchCoursesManageProps {
  search?: string;
  limit: number;
  page: number;
  isFree?: boolean;
  status?: CourseStatus;
}
