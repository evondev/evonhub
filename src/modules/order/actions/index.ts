"use server";

import CouponModel from "@/modules/coupon/models";
import CourseModel from "@/modules/course/models";
import UserModel from "@/modules/user/models";
import { OrderStatus } from "@/shared/constants/order.constants";
import { MembershipPlan, UserRole } from "@/shared/constants/user.constants";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import dayjs from "dayjs";
import { FilterQuery } from "mongoose";
import OrderModel from "../models";
import {
  FetchOrdersProps,
  OrderItemData,
  UpdateFreeOrderProps,
  UpdateOrderProps,
} from "../types";

export async function fetchCountOrdersByCourse(
  courseId: string
): Promise<number | undefined> {
  try {
    connectToDatabase();
    const count = await OrderModel.countDocuments({ course: courseId });
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
  userRole,
  userId,
  status,
}: FetchOrdersProps): Promise<OrderItemData[] | undefined> {
  try {
    connectToDatabase();
    if (userRole === UserRole.User) return;

    const skip = (page - 1) * limit;
    const query: FilterQuery<typeof OrderModel> = {};
    const findCourses = await CourseModel.find({
      author: userId,
    }).select("_id");

    if (filter) {
      query.$or = [{ code: { $regex: filter, $options: "i" } }];
    }

    if (isFree) {
      query.total = 0;
    }

    if (status) {
      query.$or = [{ status: { $regex: status, $options: "i" } }];
    }

    if (userRole === UserRole.Expert) {
      query.course = {
        $in: findCourses.map((course) => course._id),
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
        select: "title",
      })
      .populate({
        path: "coupon",
        model: CouponModel,
        select: "code amount",
      })
      .populate({
        path: "user",
        model: UserModel,
        select: "username email",
      });

    return parseData(orders);
  } catch (error) {
    console.log(error);
  }
}

export async function handleUpdateOrder({
  userRole,
  orderUser,
  code,
  status,
  plan,
  course,
  amount,
}: UpdateOrderProps): Promise<Boolean | undefined> {
  try {
    connectToDatabase();

    if (![UserRole.Admin, UserRole.Expert].includes(userRole)) return;

    const findUser = await UserModel.findById(orderUser);

    if (!findUser) return;

    const findOrder = await OrderModel.findOne({
      code,
    });

    if (findOrder?.status === OrderStatus.Rejected) return;

    await OrderModel.updateOne({ code }, { status });

    if (status === OrderStatus.Approved) {
      if (plan && plan !== MembershipPlan.None) {
        findUser.plan = plan;
        findUser.isMembership = true;
        findUser.planStartDate = dayjs().toDate();
        switch (plan) {
          case MembershipPlan.Personal:
            findUser.planEndDate = dayjs().add(1, "month").toDate();
            break;
          case MembershipPlan.Starter:
            findUser.planEndDate = dayjs().add(3, "month").toDate();
            break;
          case MembershipPlan.Master:
            findUser.planEndDate = dayjs().add(6, "month").toDate();
            break;
          case MembershipPlan.Premium:
            findUser.planEndDate = dayjs().add(1, "year").toDate();
            break;
        }

        await findUser.save();
      } else if (!findUser.courses.includes(course)) {
        findUser.courses.push(course);
        await findUser.save();
      }
      // if (Number(amount) > 0) {
      //   await resend.emails.send({
      //     from: "Evonhub@evonhub.dev",
      //     to: findUser.email,
      //     subject: "Thông báo - Đơn hàng của bạn đã được duyệt 🔥",
      //     html: `<p>Cảm ơn bạn đã mua khóa học tại <strong>evonhub</strong>. Bây giờ bạn có thể truy cập vào <a href="https://evonhub.dev/study" target="_blank">khu vực học tập</a> để bắt đầu học nha.</p>`,
      //   });
      // }
    } else {
      if (
        plan &&
        plan !== MembershipPlan.None &&
        plan !== findUser.plan &&
        findUser.isMembership
      ) {
        findUser.plan = MembershipPlan.None;
        findUser.isMembership = false;
        findUser.planEndDate = undefined;
        findUser.planStartDate = undefined;
        await findUser.save();
      } else if (!plan || plan === MembershipPlan.None) {
        findUser.courses = findUser.courses.filter(
          (course: any) => course.toString() !== course
        );
        await findUser.save();
      }
    }
    return true;
  } catch (error) {
    console.log(error);
  }
}
export async function handleUpdateFreeOrder({
  userRole,
}: UpdateFreeOrderProps): Promise<Boolean | undefined> {
  try {
    connectToDatabase();

    if (![UserRole.Admin].includes(userRole)) return;

    const orders: OrderItemData[] = await OrderModel.find({
      total: {
        $lte: 0,
      },
      status: OrderStatus.Pending,
    });

    orders.forEach(async (order) => {
      const findOrder = await OrderModel.findOne({
        code: order.code,
        total: {
          $lte: 0,
        },
      });
      const findUser = await UserModel.findById(order.user._id);

      if (findOrder && findUser) {
        findOrder.status = OrderStatus.Approved;
        await findOrder.save();
        findUser.courses.push(order.course?._id);
        await findUser.save();
      }
    });
  } catch (error) {
    console.log(error);
  }
}
