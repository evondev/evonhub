import { ECouponStatus } from "@/types/enums";
import { Document, Schema, model, models } from "mongoose";

export interface ICoupon extends Document {
  _id: string;
  title: string;
  code: string;
  amount: number;
  limit: number;
  used: number;
  course: Schema.Types.ObjectId[];
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  createdBy: Schema.Types.ObjectId;
  status: ECouponStatus;
  emails: string[];
}
const couponSchema = new Schema<ICoupon>({
  title: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  limit: { type: Number },
  used: { type: Number },
  course: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  startDate: { type: Date },
  endDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: Object.values(ECouponStatus),
    default: ECouponStatus.ACTIVE,
  },
  emails: [{ type: String }],
});
const Coupon = models.Coupon || model("Coupon", couponSchema);
export default Coupon;
