import { Document, Schema, model, models } from "mongoose";

export interface ICoupon extends Document {
  _id: string;
  title: string;
  code: string;
  type: string;
  amount: number;
  limit: number;
  course: Schema.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  createdBy: Schema.Types.ObjectId;
}
const couponSchema = new Schema<ICoupon>({
  title: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  limit: { type: Number },
  course: { type: Schema.Types.ObjectId, ref: "Course" },
  startDate: { type: Date },
  endDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
});
const Coupon = models.Coupon || model("Coupon", couponSchema);
export default Coupon;
