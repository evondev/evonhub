"use server";

import CourseModel from "@/modules/course/models";
import UserModel from "@/modules/user/models";
import { CouponStatus } from "@/shared/constants/coupon.constants";
import { UserRole } from "@/shared/constants/user.constants";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import { auth } from "@clerk/nextjs/server";
import { FilterQuery } from "mongoose";
import CouponModel from "../models";
import { CouponItemData, CreateCouponProps, FetchCouponProps } from "../types";

export async function handleCreateCoupon({
  title,
  code,
  limit,
  courses,
  startDate,
  endDate,
  amount,
  status,
  type,
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
      status,
      type,
    });
    return true;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchCoupons({
  status,
  shouldFilterOutdated,
}: {
  status?: CouponStatus;
  shouldFilterOutdated?: boolean;
}): Promise<CouponItemData[] | undefined> {
  try {
    connectToDatabase();
    const query: FilterQuery<typeof CouponModel> = {};
    if (status) {
      query.status = status;
    }
    if (shouldFilterOutdated) {
      query.endDate = {
        $gte: new Date(),
      };
    }
    const coupons = await CouponModel.find(query)
      .populate({
        model: CourseModel,
        path: "courses",
        select: "title slug",
      })
      .populate({
        model: UserModel,
        path: "createdBy",
        select: "avatar username",
      })
      .sort({ createdAt: -1 });
    return parseData(coupons);
  } catch (error) {
    console.log(error);
  }
}

export async function handleCheckCoupon({
  code,
  courseId,
}: FetchCouponProps): Promise<CouponItemData | undefined> {
  try {
    connectToDatabase();
    const findCoupon: CouponItemData | null = await CouponModel.findOne({
      code,
    });

    if (!findCoupon) return;
    let isActive = true;
    const courses = findCoupon.courses.map((course) => course.toString());

    if (!courses.includes(courseId)) {
      isActive = false;
    }

    if (findCoupon.startDate.getTime() > new Date().getTime()) {
      isActive = false;
    }

    if (findCoupon.endDate.getTime() < new Date().getTime()) {
      isActive = false;
    }

    if (findCoupon.limit > 0 && findCoupon.limit <= findCoupon.used) {
      isActive = false;
    }

    if (findCoupon.status !== CouponStatus.Active) {
      isActive = false;
    }

    if (!isActive) {
      return;
    }
    return parseData(findCoupon);
  } catch (error) {
    console.log(error);
  }
}

export async function fetchCouponByCode({
  code,
}: {
  code: string;
}): Promise<CouponItemData | undefined> {
  try {
    connectToDatabase();
    const findCoupon: CouponItemData | null = await CouponModel.findOne({
      code,
    });

    if (!findCoupon) return;

    return parseData(findCoupon);
  } catch (error) {
    console.log(error);
  }
}
