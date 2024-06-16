"use server";
import Coupon from "@/database/coupon.model";
import { connectToDatabase } from "../mongoose";

export async function getCouponInfo(couponCode: string) {
  try {
    connectToDatabase();
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    console.log("getCouponInfo ~ coupon:", coupon);
    return JSON.parse(JSON.stringify(coupon));
  } catch (error) {
    console.log(error);
  }
}
