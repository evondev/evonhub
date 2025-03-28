"use server";

import { usersHTML, usersJS, usersJSAdvanced, usersReact } from "@/data";
import CouponModel from "@/modules/coupon/models";
import OrderModel from "@/modules/order/models";
import { OrderItemData } from "@/modules/order/types";
import UserModel from "@/modules/user/models";
import { CourseStatus } from "@/shared/constants/course.constants";
import { OrderStatus } from "@/shared/constants/order.constants";
import {
  MembershipPlan,
  UserRole,
  UserStatus,
} from "@/shared/constants/user.constants";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import { UserItemData } from "@/shared/types/user.types";
import { handleCheckMembership } from "@/shared/utils";
import { auth } from "@clerk/nextjs/server";
import { FilterQuery } from "mongoose";
import CourseModel from "../models";
import {
  CourseItemData,
  EnrollCourseProps,
  FetchCoursesManageProps,
  FetchCoursesParams,
} from "../types";

export async function fetchCourses({
  status,
  isUpdateViews = true,
}: FetchCoursesParams): Promise<CourseItemData[] | undefined> {
  try {
    connectToDatabase();
    let searchQuery: any = {};
    if (status) {
      searchQuery.status = status;
    }
    const courses: CourseItemData[] = await CourseModel.find(searchQuery)
      .select("title slug image level rating price salePrice views free")
      .sort({ createdAt: -1 });
    const allCourses = (parseData(courses) as CourseItemData[]) || [];
    isUpdateViews &&
      allCourses.forEach(async (course) => {
        await updateCourseViews(course.slug);
      });
    return allCourses;
  } catch (error) {}
}

export async function fetchCoursesIncoming(): Promise<
  CourseItemData[] | undefined
> {
  try {
    connectToDatabase();
    const courses = await CourseModel.find({
      status: CourseStatus.Pending,
      _destroy: false,
    })
      .select("title slug image level rating price salePrice views free")
      .sort({ createdAt: -1 });
    return parseData(courses);
  } catch (error) {}
}

export async function fetchCourseBySlug(
  slug: string
): Promise<CourseItemData | undefined> {
  try {
    connectToDatabase();
    await updateCourseViews(slug);
    let searchQuery: any = {};
    searchQuery.slug = slug;
    const course = await CourseModel.findOne(searchQuery).select(
      "title info desc level views intro image price salePrice status slug cta ctaLink seoKeywords free author minPrice"
    );
    if (!course) return undefined;

    return parseData(course);
  } catch (error) {
    console.log("error:", error);
  }
}

export async function handleEnrollFree({
  slug,
  userId,
}: {
  slug: string;
  userId: string;
}) {
  try {
    connectToDatabase();

    const findCourse = await CourseModel.findOne({ slug, free: true });
    if (!findCourse)
      return {
        type: "error",
        message: "Khóa học không tồn tại",
      };
    const findUser = await UserModel.findById(userId);
    if (!findUser)
      return {
        type: "error",
        message: "Tài khoản không tồn tại",
      };

    findUser.courses.push(findCourse._id);
    await findUser.save();

    return {
      type: "success",
      message: "Đăng ký khóa học thành công",
    };
  } catch (error) {
    console.log(error);
  }
}

export async function handleEnrollCourse({
  userId,
  courseId,
  total,
  amount,
  couponCode,
  couponId,
}: EnrollCourseProps): Promise<
  | {
      order?: OrderItemData;
      error?: string;
    }
  | undefined
> {
  try {
    connectToDatabase();
    if (!userId) {
      return {
        error: "Không tìm thấy tài khoản!",
      };
    }

    const findUser = await UserModel.findById(userId);

    if (!findUser)
      return {
        error: "Vui lòng đăng nhập để mua khóa học",
      };

    if (findUser.status === UserStatus.Inactive)
      return {
        error: "Tài khoản của bạn đã bị khóa",
      };

    const findCoupon = await CouponModel.findOne({
      code: couponCode,
    });

    const findCourse: CourseItemData | null = await CourseModel.findById(
      courseId
    );

    if (!findCourse)
      return {
        error: "Khóa học không tồn tại",
      };

    if (findCoupon?.amount && findCourse.price - total !== findCoupon?.amount) {
      return {
        error: "Mã giảm giá không hợp lệ",
      };
    }

    const userCourses = findUser.courses
      .filter(Boolean)
      .map((course: any) => course.toString());

    if (userCourses.includes(courseId))
      return {
        error: "Bạn đã sở hữu khóa học này rồi",
      };

    let status: OrderStatus = OrderStatus.Pending;

    if (
      findCourse.slug === "khoa-hoc-html-css-master" &&
      usersHTML.includes(findUser.email)
    ) {
      findUser.courses.push(findCourse._id);
      await findUser.save();
      status = OrderStatus.Approved;
      total = 0;
      amount = 0;
    }
    if (
      ["khoa-hoc-reactjs-co-ban"].includes(findCourse.slug) &&
      usersReact.includes(findUser.email)
    ) {
      findUser.courses.push(findCourse._id);
      await findUser.save();
      status = OrderStatus.Approved;
      total = 0;
      amount = 0;
    }
    if (
      findCourse.slug === "khoa-hoc-javascript-co-ban-cho-nguoi-moi" &&
      usersJS.includes(findUser.email)
    ) {
      findUser.courses.push(findCourse._id);
      await findUser.save();
      status = OrderStatus.Approved;
      total = 0;
      amount = 0;
    }
    if (
      findCourse.slug === "khoa-hoc-javascript-chuyen-sau" &&
      usersJSAdvanced.includes(findUser.email)
    ) {
      findUser.courses.push(findCourse._id);
      await findUser.save();
      status = OrderStatus.Approved;
      total = 0;
      amount = 0;
    }

    const existOrder = await OrderModel.findOne({
      user: userId,
      course: courseId,
      status: OrderStatus.Pending,
    });
    if (existOrder) {
      return {
        error: `Bạn đang có một đơn hàng đang chờ xử lý. Truy cập vào https://evonhub.dev/order/${existOrder.code} để xem`,
      };
    }
    const orderObject: {
      user: string;
      course: string;
      total: number;
      amount: number;
      code: string;
      status: OrderStatus;
      couponCode?: string;
      coupon?: string;
    } = {
      user: userId,
      course: courseId,
      total,
      amount,
      code: `DH${new Date().getTime().toString().slice(-8)}`,
      status,
    };
    if (couponCode && couponId) {
      orderObject.couponCode = couponCode;
      orderObject.coupon = couponId;
    }
    const newOrder = new OrderModel(orderObject);
    await newOrder.save();
    return {
      order: newOrder,
    };
  } catch (error) {
    console.log(error);
  }
}

export async function handleEnrollPackage({
  userId,
  amount,
  plan,
}: {
  userId: string;
  amount: number;
  plan: MembershipPlan;
}) {
  try {
    connectToDatabase();
    const findUser: UserItemData | null = await UserModel.findById(userId);
    if (!findUser)
      return {
        error: "Vui lòng đăng nhập để thanh toán",
      };
    const allPlans = Object.values(MembershipPlan);
    if (!allPlans.includes(plan)) {
      return {
        error: "Gói không tồn tại",
      };
    }

    const isPlanActive =
      handleCheckMembership({
        isMembership: findUser.isMembership,
        endDate: findUser.planEndDate,
      }) && plan === findUser.plan;

    if (isPlanActive) {
      return {
        error: "Bạn đã đăng ký gói này rồi",
      };
    }

    const existOrder = await OrderModel.findOne({
      user: userId,
      plan,
      status: OrderStatus.Pending,
    });
    if (existOrder) {
      return {
        error: `Bạn đang có một đơn hàng đang chờ xử lý. Truy cập vào https://evonhub.dev/order/${existOrder.code} để xem`,
      };
    }
    const newOrder = new OrderModel({
      user: userId,
      plan,
      amount,
      total: amount,
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

export async function updateCourseViews(slug: string) {
  try {
    connectToDatabase();
    await CourseModel.findOneAndUpdate({ slug }, { $inc: { views: 1 } });
  } catch (error) {
    console.log(error);
  }
}

export async function fetchCoursesManage({
  isFree = false,
  search,
  limit = 10,
  page,
  status,
}: FetchCoursesManageProps): Promise<CourseItemData[] | undefined> {
  try {
    connectToDatabase();

    const { userId } = auth();
    const findUser = await UserModel.findOne({ clerkId: userId });

    if (!findUser) return;

    if (![UserRole.Admin, UserRole.Expert].includes(findUser?.role)) return;

    const query: FilterQuery<typeof CourseModel> = {};
    const skip = (page - 1) * limit;

    if (status) {
      query.$or = [{ status: { $regex: status, $options: "i" } }];
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { desc: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    if (isFree) {
      query.free = isFree;
    }

    if (findUser?.role !== UserRole.Admin) {
      query.author = findUser._id;
    }
    const courses = await CourseModel.find(query)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .select("title slug image createdAt status price _id free rating views");

    return parseData(courses);
  } catch (error) {}
}
