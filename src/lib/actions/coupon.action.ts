"use server";
import Coupon from "@/database/coupon.model";
import { connectToDatabase } from "../mongoose";

export async function getCouponInfo(couponCode: string) {
  try {
    connectToDatabase();
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    return JSON.parse(JSON.stringify(coupon));
  } catch (error) {
    console.log(error);
  }
}
export async function createCoupon(params: any) {
  try {
    connectToDatabase();
    const newCoupon = Coupon.create(params);
    return JSON.parse(JSON.stringify(newCoupon));
  } catch (error) {
    console.log(error);
  }
}
