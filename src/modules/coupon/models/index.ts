import { CouponStatus } from "@/shared/constants/coupon.constants";
import { model, models, Schema } from "mongoose";
import { CouponModelProps } from "../types";

const couponSchema = new Schema<CouponModelProps>({
  title: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  limit: { type: Number },
  used: { type: Number },
  startDate: { type: Date },
  endDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: Object.values(CouponStatus),
    default: CouponStatus.Active,
  },
  courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const CouponModel = models.Coupon || model("Coupon", couponSchema);

export default CouponModel;
