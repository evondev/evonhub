import { OrderStatus } from "@/shared/constants/order.constants";
import { MembershipPlan } from "@/shared/constants/user.constants";
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
export interface OrderItemData extends Omit<OrderModelProps, ""> {}
