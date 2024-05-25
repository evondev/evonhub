import { EOrderStatus } from "@/types/enums";
import mongoose, { Schema, models } from "mongoose";

export interface IOrder extends Document {
  _id: string;
  user: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  createdAt: Date;
  status: EOrderStatus;
  amount: number;
  discount: number;
  total: number;
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Order = models.Order || mongoose.model("Order", orderSchema);
export default Order;