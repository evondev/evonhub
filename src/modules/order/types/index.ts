import { CouponItemData } from "@/modules/coupon/types";
import { CourseItemData } from "@/modules/course/types";
import { OrderStatus } from "@/shared/constants/order.constants";
import { MembershipPlan, UserRole } from "@/shared/constants/user.constants";
import { UserItemData } from "@/shared/types/user.types";
import { Schema } from "mongoose";

export interface OrderModelProps extends Document {
  _id: string;
  code: string;
  user: Schema.Types.ObjectId;
  course?: Schema.Types.ObjectId;
  createdAt: Date;
  status: OrderStatus;
  amount: number;
  discount: number;
  total: number;
  coupon: Schema.Types.ObjectId;
  couponCode: string;
  plan: MembershipPlan;
  _destroy: boolean;
  paidAmount?: number;
  paidAt?: Date;
  paymentReferences?: string[];
  paymentNote?: string;
}

export interface SepayWebhookPayload {
  id: number;
  gateway: string;
  transactionDate: string;
  accountNumber: string;
  code: string | null;
  content: string;
  transferType: "in" | "out";
  transferAmount: number;
  accumulated: number;
  subAccount: string | null;
  referenceCode: string;
  description: string;
}
export interface OrderItemData
  extends Omit<OrderModelProps, "user" | "course" | "coupon"> {
  user: UserItemData;
  course?: CourseItemData;
  coupon?: CouponItemData;
}

export interface FetchOrdersProps {
  limit: number;
  filter?: string;
  page: number;
  isFree?: boolean;
  status?: OrderStatus;
}

export interface CreatePendingOrderInput {
  userId: string;
  courseId: string;
  amount: number;
  discount: number;
  total: number;
  couponCode?: string;
  couponId?: string;
}

export interface CreatePendingOrderResult {
  order?: OrderModelProps;
  existingOrder?: OrderModelProps;
}

export interface FetchOrderStatusProps {
  code: string;
}

export interface UpdateOrderProps {
  code: string;
  status: OrderStatus;
}
