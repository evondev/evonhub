"use server";

import { getUserById } from "@/lib/actions/user.action";
import { handleCheckCoupon } from "@/modules/coupon/actions";
import { calculateCouponDiscount } from "@/modules/coupon/utils";
import OrderModel from "@/modules/order/models";
import UserModel from "@/modules/user/models";
import { CourseStatus } from "@/shared/constants/course.constants";
import { OrderStatus } from "@/shared/constants/order.constants";
import {
  membershipPlans,
  UserRole,
  UserStatus,
} from "@/shared/constants/user.constants";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import { getCurrentUser } from "@/shared/libs/auth";
import { UserItemData } from "@/shared/types/user.types";
import { handleCheckMembership } from "@/shared/utils";
import { auth } from "@clerk/nextjs/server";
import { FilterQuery } from "mongoose";
import CourseModel from "../models";
import {
  CourseItemData,
  EnrollCourseProps,
  EnrollFreeProps,
  EnrollFreeResponse,
  EnrollPackageProps,
  EnrollResponse,
  FetchCoursesManageProps,
  FetchCoursesParams,
} from "../types";
import { isCourseOwned } from "../utils";

export async function fetchCourses({
  status,
  limit = 20,
  page = 1,
  search,
  isFree,
  isAll = true,
  shouldFilterEnrolled = false,
}: FetchCoursesParams): Promise<CourseItemData[] | undefined> {
  try {
    connectToDatabase();
    let query: FilterQuery<typeof CourseModel> = {};

    const skip = (page - 1) * limit;
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }];
    }

    if (status) {
      query.status = status;
    }

    if (isFree) {
      query.free = isFree;
    }

    const courses: CourseItemData[] = await CourseModel.find(query)
      .select("title slug image level rating price salePrice views free")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });
    const allCourses = (parseData(courses) as CourseItemData[]) || [];
    if (shouldFilterEnrolled) {
      const { userId } = auth();
      const mongoUser = (await getUserById({
        userId: userId || "",
      })) as UserItemData;
      const userCoursesIds = mongoUser?.courses.map((course: CourseItemData) =>
        course?._id ? course._id.toString() : "",
      );
      return allCourses.filter(
        (course) => !userCoursesIds?.includes(course._id.toString()),
      );
    }

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
  slug: string,
  status?: CourseStatus,
): Promise<CourseItemData | undefined> {
  try {
    connectToDatabase();
    await updateCourseViews(slug);
    let searchQuery: any = {};
    searchQuery.slug = slug;
    if (status) {
      searchQuery.status = status;
    }
    const course = await CourseModel.findOne(searchQuery).select(
      "title info desc level views intro image price salePrice status slug cta ctaLink seoKeywords free author minPrice isMicro",
    );
    if (!course) return undefined;

    return parseData(course);
  } catch (error) {
    console.log("error:", error);
  }
}

export async function handleEnrollFree({
  slug,
}: EnrollFreeProps): Promise<EnrollFreeResponse | undefined> {
  try {
    await connectToDatabase();

    const currentUser = await getCurrentUser();

    if (!currentUser)
      return {
        type: "error",
        message: "Vui lòng đăng nhập để đăng ký khóa học",
      };

    if (currentUser.status === UserStatus.Inactive)
      return {
        type: "error",
        message: "Tài khoản của bạn đã bị khóa",
      };

    const findCourse = await CourseModel.findOne({
      slug,
      free: true,
      status: CourseStatus.Approved,
    });

    if (!findCourse)
      return {
        type: "error",
        message: "Khóa học không tồn tại",
      };

    if (isCourseOwned(currentUser.courses, findCourse._id.toString()))
      return {
        type: "error",
        message: "Bạn đã sở hữu khóa học này rồi",
      };

    await UserModel.updateOne(
      { _id: currentUser._id },
      { $addToSet: { courses: findCourse._id } },
    );

    return {
      type: "success",
      message: "Đăng ký khóa học thành công",
    };
  } catch (error) {
    console.log(error);
  }
}

export async function handleEnrollCourse({
  courseId,
  couponCode,
}: EnrollCourseProps): Promise<EnrollResponse | undefined> {
  try {
    await connectToDatabase();

    const currentUser = await getCurrentUser();

    if (!currentUser)
      return {
        error: "Vui lòng đăng nhập để mua khóa học",
      };

    if (currentUser.status === UserStatus.Inactive)
      return {
        error: "Tài khoản của bạn đã bị khóa",
      };

    const findCourse: CourseItemData | null =
      await CourseModel.findById(courseId);

    if (!findCourse)
      return {
        error: "Khóa học không tồn tại",
      };

    if (findCourse.status !== CourseStatus.Approved)
      return {
        error: "Khóa học chưa được mở bán",
      };

    if (isCourseOwned(currentUser.courses, courseId))
      return {
        error: "Bạn đã sở hữu khóa học này rồi",
      };

    // Giá luôn tính lại từ DB, không tin số tiền client gửi lên
    const amount = findCourse.price;
    const appliedCoupon = couponCode
      ? await handleCheckCoupon({ code: couponCode, courseId })
      : undefined;
    const discount = calculateCouponDiscount(appliedCoupon, amount);
    const total = Math.max(amount - discount, 0);

    const orderResult = await OrderModel.findOneAndUpdate(
      {
        user: currentUser._id,
        course: courseId,
        status: OrderStatus.Pending,
      },
      {
        // user / course / status lấy từ filter khi insert, không set lại ở đây
        $setOnInsert: {
          amount,
          discount,
          total,
          code: `DH${new Date().getTime().toString().slice(-8)}`,
          couponCode: appliedCoupon?.code,
          coupon: appliedCoupon?._id,
        },
      },
      {
        upsert: true,
        new: true,
        includeResultMetadata: true,
      },
    );

    if (orderResult.lastErrorObject?.updatedExisting) {
      return {
        error: `Bạn đang có một đơn hàng đang chờ xử lý. Truy cập vào https://evonhub.dev/order/${orderResult.value?.code} để xem`,
      };
    }

    return {
      order: { code: orderResult.value?.code },
    };
  } catch (error) {
    console.log(error);
  }
}

export async function handleEnrollPackage({
  plan,
}: EnrollPackageProps): Promise<EnrollResponse | undefined> {
  try {
    await connectToDatabase();

    const currentUser = await getCurrentUser();

    if (!currentUser)
      return {
        error: "Vui lòng đăng nhập để thanh toán",
      };

    if (currentUser.status === UserStatus.Inactive)
      return {
        error: "Tài khoản của bạn đã bị khóa",
      };

    // Giá gói lấy từ constant ở server, không tin số tiền client gửi lên
    const selectedPlan = membershipPlans.find((item) => item.plan === plan);

    if (!selectedPlan)
      return {
        error: "Gói không tồn tại",
      };

    const isPlanActive =
      handleCheckMembership({
        isMembership: currentUser.isMembership,
        endDate: currentUser.planEndDate,
      }) && plan === currentUser.plan;

    if (isPlanActive) {
      return {
        error: "Bạn đã đăng ký gói này rồi",
      };
    }

    const orderResult = await OrderModel.findOneAndUpdate(
      {
        user: currentUser._id,
        plan,
        status: OrderStatus.Pending,
      },
      {
        // user / plan / status lấy từ filter khi insert, không set lại ở đây
        $setOnInsert: {
          amount: selectedPlan.price,
          total: selectedPlan.price,
          code: `DH${new Date().getTime().toString().slice(-8)}`,
        },
      },
      {
        upsert: true,
        new: true,
        includeResultMetadata: true,
      },
    );

    if (orderResult.lastErrorObject?.updatedExisting) {
      return {
        error: `Bạn đang có một đơn hàng đang chờ xử lý. Truy cập vào https://evonhub.dev/order/${orderResult.value?.code} để xem`,
      };
    }

    return {
      order: { code: orderResult.value?.code },
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
    // count total students for each course
    const coursesWithStudentCount = await Promise.all(
      courses.map(async (course) => {
        const studentCount = await UserModel.countDocuments({
          courses: course._id,
        });
        return {
          ...course.toObject(),
          studentCount,
        };
      }),
    );

    return parseData(coursesWithStudentCount);
  } catch (error) {}
}

export async function getAllCoursesUser(
  params: FetchCoursesParams,
): Promise<CourseItemData[] | undefined> {
  try {
    connectToDatabase();
    const { userId } = auth();
    const findUser: UserItemData | null = await UserModel.findOne({
      clerkId: userId,
    });

    if (!findUser) return undefined;

    const hasPermission = [UserRole.Admin, UserRole.Expert].includes(
      findUser.role,
    );

    if (!hasPermission) return undefined;

    const query: FilterQuery<typeof CourseModel> = {};

    if (params.status) {
      query.status = params.status;
    }

    if (findUser.role !== UserRole.Admin) {
      query.author = findUser._id;
    }

    const courses = await CourseModel.find(query)
      .select("title slug image createdAt status price _id free rating views")
      .sort({ createdAt: -1 });

    return courses;
  } catch (error) {}
}
