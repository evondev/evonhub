"use server";

import { usersHTML, usersJS, usersJSAdvanced, usersReact } from "@/data";
import OrderModel from "@/modules/order/models";
import UserModel from "@/modules/user/models";
import { CourseStatus } from "@/shared/constants/course.constants";
import { OrderStatus } from "@/shared/constants/order.constants";
import { MembershipPlan, UserStatus } from "@/shared/constants/user.constants";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import { UserItemData } from "@/shared/types/user.types";
import CourseModel from "../models";
import { CourseItemData, FetchCoursesParams } from "../types";

export async function fetchCourses(
  params: FetchCoursesParams
): Promise<CourseItemData[] | undefined> {
  try {
    connectToDatabase();
    let searchQuery: any = {};
    if (params.status) {
      searchQuery.status = params.status;
    }
    const courses = await CourseModel.find(searchQuery)
      .select("title slug image level rating price salePrice views free")
      .sort({ createdAt: -1 });
    return parseData(courses);
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
    let searchQuery: any = {};
    searchQuery.slug = slug;
    const course = await CourseModel.findOne(searchQuery).select(
      "title info desc level views intro image price salePrice status slug cta ctaLink seoKeywords free author minPrice"
    );
    if (!course) return undefined;

    return JSON.parse(JSON.stringify(course));
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
}: {
  userId: string;
  courseId: string;
  total: number;
  amount: number;
}) {
  try {
    connectToDatabase();
    const findUser = await UserModel.findById(userId);
    if (!findUser)
      return {
        error: "Vui lòng đăng nhập để mua khóa học",
      };
    if (findUser.status === UserStatus.Inactive)
      return {
        error: "Tài khoản của bạn đã bị khóa",
      };
    const userCourses = findUser.courses.map((course: any) =>
      course.toString()
    );
    if (userCourses.includes(courseId))
      return {
        error: "Bạn đã sở hữu khóa học này rồi",
      };
    const findCourse = await CourseModel.findById(courseId);
    if (findCourse.slug === "khoa-hoc-html-css-master") {
      if (usersHTML.includes(findUser.email)) {
        total = 0;
        amount = 0;
      }
    }
    if (findCourse.slug === "khoa-hoc-reactjs-co-ban") {
      if (usersReact.includes(findUser.email)) {
        total = 0;
        amount = 0;
      }
    }
    if (findCourse.slug === "khoa-hoc-javascript-co-ban-cho-nguoi-moi") {
      if (usersJS.includes(findUser.email)) {
        total = 0;
        amount = 0;
      }
    }
    if (findCourse.slug === "khoa-hoc-javascript-chuyen-sau") {
      if (usersJSAdvanced.includes(findUser.email)) {
        total = 0;
        amount = 0;
      }
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
    const newOrder = new OrderModel({
      user: userId,
      course: courseId,
      total,
      amount,
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
      findUser.isMembership &&
      findUser.plan === plan &&
      findUser.planEndDate > new Date();

    if (isPlanActive) {
      return {
        error: "Bạn đã đăng ký gói này rồi",
      };
    }

    const existOrder = await OrderModel.findOne({
      user: userId,
      package: plan,
      status: OrderStatus.Pending,
    });
    if (existOrder) {
      return {
        error: `Bạn đang có một đơn hàng đang chờ xử lý. Truy cập vào https://evonhub.dev/order/${existOrder.code} để xem`,
      };
    }
    const newOrder = new OrderModel({
      user: userId,
      package: plan,
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
