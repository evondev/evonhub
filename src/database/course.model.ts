import { ECourseLevel, ECourseStatus, EcourseLabel } from "@/types/enums";
import { Document, Schema } from "mongoose";

export interface ICourse extends Document {
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
  status: ECourseStatus;
  level: ECourseLevel;
  category: Schema.Types.ObjectId;
  label: EcourseLabel;
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
  free: boolean;
  isPackage: boolean;
  _destroy: boolean;
}
// Dùng chung model của module. Hai schema cùng tên "Course" thì file nào nạp
// trước thắng (schema cũ thiếu minPrice, isMicro), và index chỉ khai ở schema của module.
export { default } from "@/modules/course/models";
