"use server";

import CouponModel from "@/modules/coupon/models";
import CourseModel from "@/modules/course/models";
import UserModel from "@/modules/user/models";
import {
  getClearedMembershipFields,
  getMembershipFields,
} from "@/modules/user/utils";
import { OrderStatus } from "@/shared/constants/order.constants";
import { MembershipPlan, UserRole } from "@/shared/constants/user.constants";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import { getCurrentUser } from "@/shared/libs/auth";
import { FilterQuery } from "mongoose";
import OrderModel from "../models";
import { FetchOrdersProps, OrderItemData, UpdateOrderProps } from "../types";

export async function fetchCountOrdersByCourse(
  courseId: string
): Promise<number | undefined> {
  try {
    connectToDatabase();
    const count = await UserModel.countDocuments({ courses: courseId });
    return count;
  } catch (error) {
    console.log("error:", error);
  }
}

export async function fetchOrders({
  limit,
  filter,
  page,
  isFree,
  status,
}: FetchOrdersProps): Promise<OrderItemData[] | undefined> {
  try {
    await connectToDatabase();

    const currentUser = await getCurrentUser();

    if (!currentUser) return;
    if (![UserRole.Admin, UserRole.Expert].includes(currentUser.role)) return;

    const skip = (page - 1) * limit;
    const query: FilterQuery<typeof OrderModel> = {};

    if (filter) {
      const matchedUsers = await UserModel.find({
        email: { $regex: filter, $options: "i" },
      }).select("_id");

      query.$or = [
        { code: { $regex: filter, $options: "i" } },
        { user: { $in: matchedUsers.map((user) => user._id) } },
      ];
    }

    if (isFree) {
      query.total = 0;
    }

    if (status) {
      query.status = status;
    }

    // Expert chỉ thấy đơn hàng của khóa học do chính mình tạo
    if (currentUser.role === UserRole.Expert) {
      const authoredCourses = await CourseModel.find({
        author: currentUser._id,
      }).select("_id");

      query.course = {
        $in: authoredCourses.map((course) => course._id),
      };
    }

    const orders = await OrderModel.find(query)
      .limit(limit)
      .skip(skip)
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "course",
        model: CourseModel,
        select: "_id title",
      })
      .populate({
        path: "coupon",
        model: CouponModel,
        select: "_id code amount",
      })
      .populate({
        path: "user",
        model: UserModel,
        select: "_id username email",
      });

    return parseData(orders);
  } catch (error) {
    console.log(error);
  }
}

export async function handleUpdateOrder({
  code,
  status,
}: UpdateOrderProps): Promise<boolean | undefined> {
  try {
    await connectToDatabase();

    const currentUser = await getCurrentUser();

    if (!currentUser) return;
    if (![UserRole.Admin, UserRole.Expert].includes(currentUser.role)) return;

    // Toàn bộ thông tin đơn hàng lấy từ DB, client chỉ gửi lên mã đơn
    const findOrder = await OrderModel.findOne({ code });

    if (!findOrder || findOrder.status === OrderStatus.Rejected) return;

    const findUser = await UserModel.findById(findOrder.user);

    if (!findUser) return;

    // Expert chỉ được xử lý đơn của khóa học do chính mình tạo
    if (currentUser.role === UserRole.Expert) {
      const isCourseAuthor =
        !!findOrder.course &&
        !!(await CourseModel.exists({
          _id: findOrder.course,
          author: currentUser._id,
        }));

      if (!isCourseAuthor) return;
    }

    const isMembershipOrder =
      !!findOrder.plan && findOrder.plan !== MembershipPlan.None;

    findOrder.status = status;
    await findOrder.save();

    if (status === OrderStatus.Approved) {
      if (isMembershipOrder) {
        await UserModel.updateOne(
          { _id: findUser._id },
          getMembershipFields(findOrder.plan)
        );
      } else if (findOrder.course) {
        await UserModel.updateOne(
          { _id: findUser._id },
          { $addToSet: { courses: findOrder.course } }
        );
      }

      return true;
    }

    if (isMembershipOrder) {
      if (findUser.isMembership && findUser.plan === findOrder.plan) {
        await UserModel.updateOne(
          { _id: findUser._id },
          getClearedMembershipFields()
        );
      }
    } else if (findOrder.course) {
      await UserModel.updateOne(
        { _id: findUser._id },
        { $pull: { courses: findOrder.course } }
      );
    }

    return true;
  } catch (error) {
    console.log(error);
  }
}

export async function handleUpdateFreeOrder(): Promise<boolean | undefined> {
  try {
    await connectToDatabase();

    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== UserRole.Admin) return;

    const freeOrders = await OrderModel.find({
      total: { $lte: 0 },
      status: OrderStatus.Pending,
      course: { $ne: null },
    });

    for (const order of freeOrders) {
      await OrderModel.updateOne(
        { _id: order._id },
        { status: OrderStatus.Approved }
      );
      await UserModel.updateOne(
        { _id: order.user },
        { $addToSet: { courses: order.course } }
      );
    }

    return true;
  } catch (error) {
    console.log(error);
  }
}
