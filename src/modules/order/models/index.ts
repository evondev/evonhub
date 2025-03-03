import { OrderStatus } from "@/shared/constants/order.constants";
import { MembershipPlan } from "@/shared/constants/user.constants";
import mongoose, { models, Schema } from "mongoose";
import { OrderModelProps } from "../types";

const orderSchema = new Schema<OrderModelProps>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: false,
  },
  status: {
    type: String,
    enum: [OrderStatus.Pending, OrderStatus.Approved, OrderStatus.Rejected],
    default: OrderStatus.Pending,
  },
  amount: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
  },
  total: {
    type: Number,
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  couponCode: {
    type: String,
  },
  coupon: {
    type: Schema.Types.ObjectId,
    ref: "Coupon",
  },
  _destroy: {
    type: Boolean,
    default: false,
  },
  plan: {
    type: String,
    enum: Object.values(MembershipPlan),
    default: MembershipPlan.None,
  },
});
const OrderModel = models.Order || mongoose.model("Order", orderSchema);
export default OrderModel;
