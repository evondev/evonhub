import { OrderStatus } from "@/shared/constants/order.constants";
import { UserPackage } from "@/shared/constants/user.constants";
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
  package: UserPackage;
}
export interface OrderItemData extends Omit<OrderModelProps, ""> {}
