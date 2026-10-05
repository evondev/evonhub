"use server";

import CouponModel from "@/modules/coupon/models";
import CourseModel from "@/modules/course/models";
import UserModel from "@/modules/user/models";
import { OrderStatus } from "@/shared/constants/order.constants";
import { UserRole } from "@/shared/constants/user.constants";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import { getCurrentUser } from "@/shared/libs/auth";
import { FilterQuery } from "mongoose";
import OrderModel from "../models";
import {
  decrementCouponUsage,
  incrementCouponUsage,
} from "../services/coupon-usage.service";
import {
  grantOrderToUser,
  revokeOrderFromUser,
} from "../services/grant-order.service";
import {
  FetchOrdersProps,
  FetchOrderStatusProps,
  OrderItemData,
  UpdateOrderProps,
} from "../types";

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

/** Toàn bộ đơn hàng của chính user đang đăng nhập, mới nhất trước. */
export async function fetchMyOrders(): Promise<OrderItemData[] | undefined> {
  try {
    await connectToDatabase();

    const currentUser = await getCurrentUser();

    if (!currentUser) return;

    const orders = await OrderModel.find({ user: currentUser._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "course",
        model: CourseModel,
        select: "_id title slug image",
      });

    return parseData(orders);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Trạng thái đơn hàng của chính user đang đăng nhập, dùng để trang thanh toán
 * tự cập nhật khi webhook SePay duyệt đơn.
 */
export async function fetchOrderStatus({
  code,
}: FetchOrderStatusProps): Promise<OrderStatus | undefined> {
  try {
    await connectToDatabase();

    const currentUser = await getCurrentUser();

    if (!currentUser) return;

    const findOrder = await OrderModel.findOne({
      code,
      user: currentUser._id,
    }).select("status");

    return findOrder?.status;
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
    if (!Object.values(OrderStatus).includes(status)) return;

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

    const previousStatus = findOrder.status;

    // Chỉ đổi khi trạng thái chưa bị ai đổi trước (webhook / admin khác), để
    // lượt dùng mã giảm giá không bị cộng trùng
    const updatedOrder = await OrderModel.findOneAndUpdate(
      { _id: findOrder._id, status: previousStatus },
      { $set: { status } },
      { new: true },
    );

    if (!updatedOrder) return;

    const isNewlyApproved =
      previousStatus !== OrderStatus.Approved &&
      status === OrderStatus.Approved;
    const isApprovalRevoked =
      previousStatus === OrderStatus.Approved &&
      status !== OrderStatus.Approved;

    if (status === OrderStatus.Approved) {
      await grantOrderToUser(updatedOrder);
    } else {
      await revokeOrderFromUser(updatedOrder);
    }

    if (isNewlyApproved) {
      await incrementCouponUsage(updatedOrder);
    }

    if (isApprovalRevoked) {
      await decrementCouponUsage(updatedOrder);
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
      const approveResult = await OrderModel.updateOne(
        { _id: order._id, status: OrderStatus.Pending },
        { status: OrderStatus.Approved }
      );

      if (!approveResult.modifiedCount) continue;

      await UserModel.updateOne(
        { _id: order.user },
        { $addToSet: { courses: order.course } }
      );
      await incrementCouponUsage(order);
    }

    return true;
  } catch (error) {
    console.log(error);
  }
}
