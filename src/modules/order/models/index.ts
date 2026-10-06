import {
  OrderPaymentMethod,
  OrderStatus,
} from "@/shared/constants/order.constants";
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
    enum: [
      OrderStatus.Pending,
      OrderStatus.Approved,
      OrderStatus.Rejected,
      OrderStatus.Expired,
    ],
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
  // Đơn cũ không có trường này là đơn SePay
  paymentMethod: {
    type: String,
    enum: Object.values(OrderPaymentMethod),
    default: OrderPaymentMethod.Sepay,
  },
  // Tổng số tiền đã nhận được qua SePay, cộng dồn nếu khách chuyển nhiều lần
  paidAmount: {
    type: Number,
    default: 0,
  },
  paidAt: {
    type: Date,
  },
  // Id giao dịch SePay đã xử lý, dùng để chặn cộng trùng khi webhook gọi lại
  paymentReferences: {
    type: [String],
    default: [],
  },
  paymentNote: {
    type: String,
  },
  // Chỉ gửi email nhắc thanh toán đúng một lần cho mỗi đơn
  reminderSentAt: {
    type: Date,
  },
  plan: {
    type: String,
    enum: Object.values(MembershipPlan),
    default: MembershipPlan.None,
  },
});
// webhook SePay và trang trạng thái đơn (poll 5 giây) tìm theo mã
orderSchema.index({ code: 1 });
// đơn đang chờ của user cho một khóa
orderSchema.index({ user: 1, course: 1, status: 1 });
// đơn của tôi
orderSchema.index({ user: 1, createdAt: -1 });
// tab trạng thái ở trang quản lý đơn, cron nhắc thanh toán
orderSchema.index({ status: 1, createdAt: -1 });
const OrderModel = models.Order || mongoose.model("Order", orderSchema);
export default OrderModel;
