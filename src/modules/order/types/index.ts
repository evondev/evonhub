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
  userRole?: UserRole;
  userId?: string;
  status?: OrderStatus;
}

export interface UpdateOrderProps {
  code: string;
  orderUser: string;
  course?: string;
  status: OrderStatus;
  plan?: MembershipPlan;
  userRole: UserRole;
  amount?: number;
}

export interface UpdateFreeOrderProps {
  userRole: UserRole;
}
