"use server";
import { usersHTML, usersJS, usersJSAdvanced, usersReact } from "@/data";
import Course from "@/database/course.model";
import User from "@/database/user.model";
import CourseModel from "@/modules/course/models";
import OrderModel from "@/modules/order/models";
import UserModel from "@/modules/user/models";
import { MembershipPlan, UserRole } from "@/shared/constants/user.constants";
import {
  formatRemainingPendingTime,
  getPendingOrderExpiryDate,
} from "@/modules/order/utils";
import { EOrderStatus, EUserStatus, Role } from "@/types/enums";
import { auth } from "@clerk/nextjs/server";
import dayjs from "dayjs";
import { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";

// const resend = new Resend(process.env.RESEND_API_KEY);

interface CreateOrderParams {
  user: string;
  course: string;
  amount: number;
  discount?: number;
  total: number;
  status: EOrderStatus;
  couponCode?: string;
}
export async function createOrder(params: CreateOrderParams) {
  try {
    connectToDatabase();
    const newOrder = new OrderModel({
      ...params,
      code: `DH${new Date().getTime().toString().slice(-8)}`,
    });
    await newOrder.save();
  } catch (error) {}
}
interface UpdateOrderParams {
  code: string;
  user: string;
  course?: string;
  status: EOrderStatus;
  plan?: MembershipPlan;
}
export async function updateOrder(params: UpdateOrderParams) {
  try {
    connectToDatabase();
    const { userId } = auth();
    const user = await UserModel.findOne({ clerkId: userId });
    if (!user) return;
    if (![Role.ADMIN, Role.EXPERT].includes(user?.role)) return;
    const findUser = await UserModel.findById(params.user);
    if (!findUser) return;
    const findOrder = await OrderModel.findOne({
      code: params.code,
    });
    if (findOrder?.status === EOrderStatus.REJECTED) return;
    await OrderModel.updateOne(
      { code: params.code },
      { status: params.status }
    );
    if (params.status === EOrderStatus.APPROVED) {
      if (params.plan && params.plan !== MembershipPlan.None) {
        findUser.plan = params.plan;
        findUser.isMembership = true;
        switch (params.plan) {
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
      } else if (!findUser.courses.includes(params.course)) {
        findUser.courses.push(params.course);
        await findUser.save();
      }
      // Send email
      // await resend.emails.send({
      //   from: "Evonhub@evonhub.dev",
      //   to: findUser.email,
      //   subject: "Thông báo - Đơn hàng của bạn đã được duyệt 🔥",
      //   html: `<p>Cảm ơn bạn đã mua khóa học tại <strong>evonhub</strong>. Bây giờ bạn có thể truy cập vào <a href="https://evonhub.dev/study" target="_blank">khu vực học tập</a> để bắt đầu học nha.</p>`,
      // });
    } else {
      if (
        params.plan &&
        params.plan !== MembershipPlan.None &&
        params.plan !== findUser.plan &&
        findUser.isMembership
      ) {
        findUser.plan = MembershipPlan.None;
        findUser.isMembership = false;
        findUser.planEndDate = undefined;
        await findUser.save();
      } else if (!params.plan || params.plan === MembershipPlan.None) {
        findUser.courses = findUser.courses.filter(
          (course: any) => course.toString() !== params.course
        );
        await findUser.save();
      }
    }
    revalidatePath("/admin/order/manage");
  } catch (error) {
    console.log(error);
  }
}
export async function getAllOrders(params: {
  limit?: number;
  userId?: string;
  searchQuery?: string;
  page?: number;
  freeOrders?: boolean;
}) {
  try {
    connectToDatabase();
    const findUser = await UserModel.findById(params.userId);
    const userCourses = await CourseModel.find({ author: findUser?._id });
    const { page = 1, limit = 10, searchQuery } = params;
    const skipAmount = (page - 1) * limit;
    const query: FilterQuery<typeof OrderModel> = {};
    if (searchQuery) {
      query.$or = [{ code: { $regex: searchQuery, $options: "i" } }];
    }
    if (params.freeOrders) {
      query.total = 0;
    }
    if (findUser?.role === UserRole.Expert) {
      query.course = { $in: userCourses.map((course) => course._id) };
    }
    const orders = await OrderModel.find(query)
      .limit(params.limit || 500)
      .populate({
        path: "course",
        model: CourseModel,
        select: "title",
      })
      .populate({
        path: "user",
        model: UserModel,
        select: "username email",
      })
      .skip(skipAmount)
      .limit(limit)
      .sort({
        createdAt: -1,
      });
    return orders;
  } catch (error) {
    console.log(error);
  }
}
export async function userBuyCourse(params: Partial<CreateOrderParams>) {
  try {
    connectToDatabase();
    const findUser = await UserModel.findById(params.user);
    if (!findUser)
      return {
        error: "Vui lòng đăng nhập để mua khóa học",
      };
    if (findUser.status === EUserStatus.INACTIVE)
      return {
        error: "Tài khoản của bạn đã bị khóa",
      };
    const userCourses = findUser.courses.map((course: any) =>
      course.toString()
    );
    if (userCourses.includes(params.course?.toString()))
      return {
        error: "Bạn đã sở hữu khóa học này rồi",
      };
    const findCourse = await Course.findById(params.course);
    if (findCourse.slug === "khoa-hoc-html-css-master") {
      if (usersHTML.includes(findUser.email)) {
        params.total = 0;
        params.amount = 0;
        params.discount = 0;
      }
    }
    if (findCourse.slug === "khoa-hoc-reactjs-co-ban") {
      if (usersReact.includes(findUser.email)) {
        params.total = 0;
        params.amount = 0;
        params.discount = 0;
      }
    }
    if (findCourse.slug === "khoa-hoc-javascript-co-ban-cho-nguoi-moi") {
      if (usersJS.includes(findUser.email)) {
        params.total = 0;
        params.amount = 0;
        params.discount = 0;
      }
    }
    if (findCourse.slug === "khoa-hoc-javascript-chuyen-sau") {
      if (usersJSAdvanced.includes(findUser.email)) {
        params.total = 0;
        params.amount = 0;
        params.discount = 0;
      }
    }

    // Đơn PENDING quá hạn thì cho hết hạn để khách tạo đơn mới được
    await OrderModel.updateMany(
      {
        user: params.user,
        course: params.course,
        status: EOrderStatus.PENDING,
        createdAt: { $lte: getPendingOrderExpiryDate() },
      },
      { status: EOrderStatus.EXPIRED }
    );

    const existOrder = await OrderModel.findOne({
      user: params.user,
      course: params.course,
      status: EOrderStatus.PENDING,
    });
    if (existOrder) {
      const remainingTime = formatRemainingPendingTime(existOrder.createdAt);

      return {
        error: `Bạn có đơn hàng chưa thanh toán, còn hiệu lực ${remainingTime} nữa. Truy cập vào https://evonhub.dev/order/${existOrder.code} để thanh toán.`,
      };
    }
    const newOrder = new OrderModel({
      ...params,
      code: `DH${new Date().getTime().toString().slice(-8)}`,
    });
    await newOrder.save();
    return {
      order: newOrder,
    };
  } catch (error) {
    console.log(error);
  }
}
export async function getOrderDetails(orderId: string) {
  try {
    connectToDatabase();
    const order = await OrderModel.findOne({ code: orderId })
      .select("code amount total status plan")
      .populate("user")
      .populate({
        path: "course",
        model: Course,
        select: "title slug",
        populate: {
          path: "author",
          model: User,
          select: "bank",
        },
      });
    return order;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteUnpaidOrders(params: { userId: string }) {
  try {
    connectToDatabase();
    const query: FilterQuery<typeof OrderModel> = {};
    const findUser = await UserModel.findById(params.userId);
    const userCourses = await Course.find({ author: findUser?._id });
    query.course = { $in: userCourses.map((course) => course._id) };
    const orders = await OrderModel.find({
      status: EOrderStatus.PENDING,
      createdAt: {
        // Đơn tạo TRƯỚC mốc 24h, tức đã quá hạn thanh toán
        $lte: getPendingOrderExpiryDate(),
      },
      ...query,
    });

    if (!orders.length)
      return {
        error: "Không có đơn hàng quá hạn",
      };

    // Không xóa cứng, chỉ chuyển trạng thái để giữ lại dữ liệu lịch sử
    await OrderModel.updateMany(
      {
        _id: { $in: orders.map((order) => order._id) },
      },
      { status: EOrderStatus.EXPIRED }
    );
    revalidatePath("/admin/order/manage");
  } catch (error) {
    console.log(error);
  }
}
