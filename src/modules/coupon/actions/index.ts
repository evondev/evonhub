"use server";

import UserModel from "@/modules/user/models";
import { CouponStatus } from "@/shared/constants/coupon.constants";
import { UserRole } from "@/shared/constants/user.constants";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import { auth } from "@clerk/nextjs/server";
import CouponModel from "../models";
import { CouponItemData, CreateCouponProps } from "../types";

export async function handleCreateCoupon({
  title,
  code,
  limit,
  courses,
  startDate,
  endDate,
  amount,
}: CreateCouponProps): Promise<boolean | undefined> {
  try {
    connectToDatabase();

    const { userId } = auth();
    const findUser = await UserModel.findOne({ clerkId: userId });

    if (!findUser || findUser.role !== UserRole.Admin) return false;

    const existCoupon: CouponItemData | null = await CouponModel.findOne({
      code,
    });

    if (existCoupon?.code) {
      return false;
    }

    await CouponModel.create({
      title,
      code: code.toUpperCase(),
      limit,
      courses,
      startDate,
      endDate,
      createdBy: findUser._id,
      amount,
    });
    return true;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchCoupons(): Promise<CouponItemData[] | undefined> {
  try {
    connectToDatabase();
    const coupons = await CouponModel.find({
      status: CouponStatus.Active,
    });
    return parseData(coupons);
  } catch (error) {
    console.log(error);
  }
}
