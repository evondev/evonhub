import { CouponStatus } from "@/shared/constants/coupon.constants";
import { Document, Schema } from "mongoose";
import { z } from "zod";
import { createCouponSchema } from "../schemas";

export interface CouponModelProps extends Document {
  _id: string;
  title: string;
  code: string;
  amount: number;
  limit: number;
  used: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  status: CouponStatus;
  courses: Schema.Types.ObjectId[];
  users: Schema.Types.ObjectId[];
  createdBy: Schema.Types.ObjectId;
}

export type CreateCouponFormValues = z.infer<typeof createCouponSchema>;
export interface CouponItemData extends CouponModelProps {}

export interface CreateCouponProps {
  title: string;
  code: string;
  amount: number;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
  courses?: string[];
  users?: string[];
}

export interface FetchCouponProps {
  code: string;
  courseId: string;
}
