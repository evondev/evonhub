import { EOrderStatus } from "@/types/enums";
import mongoose, { Schema, models } from "mongoose";

export interface IOrder extends Document {
  _id: string;
  code: string;
  user: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  createdAt: Date;
  status: EOrderStatus;
  amount: number;
  discount: number;
  total: number;
  couponCode: string;
  _destroy: boolean;
}
const orderSchema = new Schema<IOrder>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  status: {
    type: String,
    enum: [EOrderStatus.PENDING, EOrderStatus.APPROVED, EOrderStatus.REJECTED],
    default: EOrderStatus.PENDING,
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
  _destroy: {
    type: Boolean,
    default: false,
  },
});
const Order = models.Order || mongoose.model("Order", orderSchema);
export default Order;
