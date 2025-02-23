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
  couponCode: string;
  _destroy: boolean;
  plan: MembershipPlan;
}
export interface OrderItemData
  extends Omit<OrderModelProps, "user" | "course"> {
  user: UserItemData;
  course?: CourseItemData;
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
