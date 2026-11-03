"use server";

import { getUserById } from "@/lib/actions/user.action";
import { recordActivity } from "@/modules/activity/services/activity.service";
import { buildOrderActivityDetail } from "@/modules/activity/utils/activity-detail.utils";
import { handleCheckCoupon } from "@/modules/coupon/actions";
import { calculateCouponDiscount } from "@/modules/coupon/utils";
import OrderModel from "@/modules/order/models";
import { createPendingOrder } from "@/modules/order/services/create-pending-order.service";
import {
  formatRemainingPendingTime,
  getPaymentQrUrl,
  toManualPaymentPayee,
} from "@/modules/order/utils";
import {
  sendManualOrderCreatedEmail,
  sendManualOrderPendingExpertEmail,
  sendOrderCreatedEmail,
} from "@/modules/email/services/order-email.service";
import CategoryModel from "@/modules/category/models";
import LectureModel from "@/modules/lecture/models";
import LessonModel from "@/modules/lesson/models";
import UserModel from "@/modules/user/models";
import { ActivityType } from "@/shared/constants/activity.constants";
import {
  COURSE_ONLY_QUERY,
  CourseStatus,
  CourseType,
} from "@/shared/constants/course.constants";
import {
  OrderPaymentMethod,
  OrderStatus,
} from "@/shared/constants/order.constants";
import { UserRole, UserStatus } from "@/shared/constants/user.constants";
import {
  buildStatusCountPipeline,
  getStatusCount,
  parseData,
  toStatusCountMap,
} from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import {
  canAccessCourseContent,
  getCurrentAdmin,
  getCurrentCourseManager,
  getCurrentStaff,
  getCurrentUser,
} from "@/shared/libs/auth";
import { StatusCountGroup } from "@/shared/types/count.types";
import { UserItemData } from "@/shared/types/user.types";
import { auth } from "@clerk/nextjs/server";
import { FilterQuery, Types } from "mongoose";
import { cache } from "react";
import { EXPLORE_SORT_STAGES } from "../constants";
import CourseModel from "../models";
import {
  FetchCoursesManageResult,
  StudentCountByCourse,
} from "../types/course-manage.types";
import {
  CourseItemData,
  CreateVideoProps,
  CreateVideoResponse,
  EnrollCourseProps,
  EnrollFreeProps,
  EnrollFreeResponse,
  EnrollResponse,
  ExploreCoursesResult,
  ExploreFacetResult,
  FetchCoursesManageProps,
  FetchCoursesParams,
  FetchExploreCoursesParams,
  FetchVideosParams,
  VideoCategoryOption,
  VideoDetailsData,
  VideoListItem,
  VideoUpdateData,
} from "../types";
import { escapeRegExp, isCourseFree, isCourseOwned } from "../utils";

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
    await connectToDatabase();
    // Khóa đã soft-delete thì không được lọt vào bất kỳ danh sách nào
    let query: FilterQuery<typeof CourseModel> = {
      _destroy: false,
      ...COURSE_ONLY_QUERY,
    };

    const skip = (page - 1) * limit;
    if (search) {
      query.$or = [{ title: { $regex: escapeRegExp(search), $options: "i" } }];
    }

    // Khách chỉ thấy khóa đang bán; trạng thái khác chỉ admin/expert lọc được
    const isPublicStatus = status === CourseStatus.Approved;
    const canFilterAnyStatus = !isPublicStatus && !!(await getCurrentStaff());

    query.status = CourseStatus.Approved;

    if (canFilterAnyStatus) {
      if (status) query.status = status;
      else delete query.status;
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

/**
 * Khóa đang bán cho trang Khóa học: lọc, sắp xếp, chia trang ngay trong DB và
 * trả kèm tổng số khóa khớp để vẽ phân trang có số.
 */
export async function fetchExploreCourses({
  search,
  isFree,
  level,
  sort,
  page,
  limit,
}: FetchExploreCoursesParams): Promise<ExploreCoursesResult | undefined> {
  try {
    await connectToDatabase();

    const matchQuery: FilterQuery<typeof CourseModel> = {
      _destroy: false,
      status: CourseStatus.Approved,
      ...COURSE_ONLY_QUERY,
    };

    if (search) {
      matchQuery.title = { $regex: escapeRegExp(search), $options: "i" };
    }

    // Cùng định nghĩa với isCourseFree: bật cờ free và giá 0
    if (isFree) {
      matchQuery.free = true;
      matchQuery.price = { $lte: 0 };
    }

    if (level) matchQuery.level = level;

    const [facetResult] = await CourseModel.aggregate<ExploreFacetResult>([
      { $match: matchQuery },
      {
        $addFields: {
          averageRating: { $avg: "$rating" },
          ratingCount: { $size: { $ifNull: ["$rating", []] } },
        },
      },
      { $sort: EXPLORE_SORT_STAGES[sort] },
      {
        $facet: {
          courses: [
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
              $project: {
                title: 1,
                slug: 1,
                image: 1,
                level: 1,
                rating: 1,
                price: 1,
                salePrice: 1,
                views: 1,
                free: 1,
              },
            },
          ],
          total: [{ $count: "value" }],
        },
      },
    ]);

    return {
      courses: parseData(facetResult?.courses || []),
      total: facetResult?.total[0]?.value || 0,
    };
  } catch (error) {
    console.error("fetchExploreCourses error:", error);
  }
}

export async function fetchCoursesIncoming(): Promise<
  CourseItemData[] | undefined
> {
  try {
    await connectToDatabase();
    const courses = await CourseModel.find({
      status: CourseStatus.Pending,
      _destroy: false,
      ...COURSE_ONLY_QUERY,
    })
      .select("title slug image level rating price salePrice views free")
      .sort({ createdAt: -1 });
    return parseData(courses);
  } catch (error) {}
}

// File "use server" chỉ export được async function nên cache() đặt ở hàm nội bộ:
// generateMetadata và page trong cùng một request dùng chung một lần đọc
const findCourseBySlug = cache(async (slug: string, status?: CourseStatus) => {
  await connectToDatabase();

  const searchQuery: FilterQuery<typeof CourseModel> = {
    slug,
    _destroy: false,
  };
  if (status) {
    searchQuery.status = status;
  }

  return CourseModel.findOne(searchQuery).select(
    "title info desc level views intro image price salePrice status slug cta ctaLink seoKeywords free author minPrice isMicro type",
  );
});

/** Chỉ đọc, không tăng lượt xem: lượt xem tăng ở trang chi tiết khóa (incrementCourseViews) */
export async function fetchCourseBySlug(
  slug: string,
  status?: CourseStatus,
): Promise<CourseItemData | undefined> {
  try {
    const course = await findCourseBySlug(slug, status);
    if (!course) return undefined;

    // Đang bán và sắp ra mắt là trang công khai. Khóa ngừng bán chỉ người đã mua
    // (vào học tiếp) hoặc người quản lý khóa mới đọc được
    if (
      course.status === CourseStatus.Rejected &&
      !(await canAccessCourseContent(course._id.toString()))
    )
      return undefined;

    // Khóa lưu trữ đã xóa nội dung: chỉ người quản lý khóa còn đọc được,
    // người đã mua cũng không vào được
    if (
      course.status === CourseStatus.Archived &&
      !(await getCurrentCourseManager(course._id.toString()))
    )
      return undefined;

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

    // Khóa miễn phí phải vừa bật cờ free vừa có giá 0: cờ free bật nhầm trên
    // khóa có giá thì không được phép cho lấy miễn phí
    const findCourse = await CourseModel.findOne({
      slug,
      free: true,
      price: { $lte: 0 },
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
    await recordActivity({
      userId: currentUser._id,
      type: ActivityType.EnrollFree,
      courseId: findCourse._id,
    });

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

    // Khóa của chuyên gia: khách chuyển thẳng cho chuyên gia, chuyên gia tự
    // duyệt. Đơn 0 đồng không có gì để chuyển, vẫn đi luồng duyệt đơn miễn phí.
    const courseAuthor = await UserModel.findById(findCourse.author).select(
      "name username email role bank socials",
    );
    const isManualPayment =
      courseAuthor?.role === UserRole.Expert && total > 0;
    const payee = isManualPayment
      ? toManualPaymentPayee(courseAuthor)
      : undefined;

    if (isManualPayment && !payee)
      return {
        error:
          "Chuyên gia của khóa học này chưa cập nhật tài khoản nhận tiền nên chưa nhận đơn được. Bạn quay lại sau nhé.",
      };

    const { order, existingOrder } = await createPendingOrder({
      userId: currentUser._id.toString(),
      courseId,
      amount,
      discount,
      total,
      couponCode: appliedCoupon?.code,
      couponId: appliedCoupon?._id,
      paymentMethod: isManualPayment
        ? OrderPaymentMethod.Manual
        : OrderPaymentMethod.Sepay,
    });

    if (existingOrder) {
      const remainingTime = formatRemainingPendingTime(existingOrder.createdAt);

      return {
        error: `Bạn có đơn hàng chưa thanh toán, còn hiệu lực ${remainingTime} nữa. Truy cập vào https://evonhub.dev/order/${existingOrder.code} để thanh toán.`,
      };
    }

    if (order?.code) {
      await recordActivity({
        userId: currentUser._id,
        type: ActivityType.CreateOrder,
        courseId,
        detail: buildOrderActivityDetail(order.code, order.total),
      });
    }

    // Email hướng dẫn thanh toán gửi ngay, không để khách phải chờ email nhắc.
    // Gửi hỏng cũng không được làm hỏng đơn vừa tạo.
    if (order?.code) {
      try {
        const emailData = {
          code: order.code,
          username: currentUser.username || "bạn",
          total: order.total,
          courseTitle: findCourse.title,
        };

        if (payee) {
          await sendManualOrderCreatedEmail(currentUser.email, {
            ...emailData,
            payee,
          });
        } else {
          await sendOrderCreatedEmail(currentUser.email, {
            ...emailData,
            qrUrl: getPaymentQrUrl(order.code, order.total),
          });
        }
      } catch (error) {
        console.log("[order] Gửi email hướng dẫn thanh toán lỗi:", error);
      }
    }

    // Tiền chuyển thẳng cho chuyên gia, hệ thống không tự đối soát được nên
    // báo chuyên gia kiểm tra tài khoản rồi vào duyệt đơn
    if (order?.code && payee?.email) {
      try {
        await sendManualOrderPendingExpertEmail(payee.email, {
          code: order.code,
          studentName: currentUser.name || currentUser.username || "Học viên",
          studentEmail: currentUser.email,
          total: order.total,
          courseTitle: findCourse.title,
          payee,
        });
      } catch (error) {
        console.log("[order] Gửi email báo chuyên gia có đơn mới lỗi:", error);
      }
    }

    return {
      order: { code: order?.code || "" },
    };
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
}: FetchCoursesManageProps): Promise<FetchCoursesManageResult | undefined> {
  try {
    const currentStaff = await getCurrentStaff();

    if (!currentStaff) return;

    // Từ khoá, lọc miễn phí và quyền expert áp cho cả số đếm của từng tab;
    // trạng thái chỉ áp cho danh sách
    const baseQuery: FilterQuery<typeof CourseModel> = {};
    const skip = (page - 1) * limit;

    if (search) {
      baseQuery.title = { $regex: escapeRegExp(search), $options: "i" };
    }

    // Cùng định nghĩa với isCourseFree: cờ free bật và giá 0
    if (isFree) {
      baseQuery.free = true;
      baseQuery.price = { $lte: 0 };
    }

    // ObjectId tường minh: baseQuery còn dùng cho $match, nơi không tự ép kiểu như find()
    if (currentStaff.role !== UserRole.Admin) {
      baseQuery.author = new Types.ObjectId(String(currentStaff._id));
    }

    const query: FilterQuery<typeof CourseModel> = { ...baseQuery };

    if (status) query.status = status;

    // Một aggregate đếm mọi tab thay vì mỗi tab một countDocuments
    const [courses, statusCountGroups] = await Promise.all([
      CourseModel.find(query)
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 })
        .select("title slug image createdAt status price _id free type"),
      CourseModel.aggregate<StatusCountGroup>(
        buildStatusCountPipeline(baseQuery),
      ),
    ]);
    const statusCountMap = toStatusCountMap(statusCountGroups);
    const total = getStatusCount(statusCountMap, status);

    // Một lần aggregate cho cả trang thay vì đếm từng khóa. $setIntersection bỏ
    // id lặp trong user.courses: mỗi học viên chỉ tính một lần, như countDocuments
    const courseIds = courses.map((course) => course._id);
    const studentCounts: StudentCountByCourse[] = await UserModel.aggregate([
      { $match: { courses: { $in: courseIds } } },
      { $project: { courses: { $setIntersection: ["$courses", courseIds] } } },
      { $unwind: "$courses" },
      { $group: { _id: "$courses", count: { $sum: 1 } } },
    ]);
    const studentCountMap = new Map(
      studentCounts.map((studentCount) => [
        String(studentCount._id),
        studentCount.count,
      ]),
    );
    const coursesWithStudentCount = courses.map((course) => ({
      ...course.toObject(),
      studentCount: studentCountMap.get(String(course._id)) || 0,
    }));

    return {
      courses: parseData(coursesWithStudentCount),
      total,
      tabCounts: {
        all: getStatusCount(statusCountMap),
        [CourseStatus.Approved]: getStatusCount(
          statusCountMap,
          CourseStatus.Approved,
        ),
        [CourseStatus.Pending]: getStatusCount(
          statusCountMap,
          CourseStatus.Pending,
        ),
        [CourseStatus.Rejected]: getStatusCount(
          statusCountMap,
          CourseStatus.Rejected,
        ),
        [CourseStatus.Archived]: getStatusCount(
          statusCountMap,
          CourseStatus.Archived,
        ),
      },
    };
  } catch (error) {
    console.log(error);
  }
}

export async function getAllCoursesUser(
  params: FetchCoursesParams,
): Promise<CourseItemData[] | undefined> {
  try {
    await connectToDatabase();
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

    if (params.statuses?.length) {
      query.status = { $in: params.statuses };
    } else if (params.status) {
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

/**
 * Tạo video lẻ: một course `type: video` kèm một chương ẩn và một bài học cùng
 * tên. Người tạo chỉ thấy một form, phần chương và bài do server dựng.
 */
export async function createVideo({
  title,
  slug,
}: CreateVideoProps): Promise<CreateVideoResponse> {
  try {
    await connectToDatabase();
    const currentAdmin = await getCurrentAdmin();

    if (!currentAdmin)
      return {
        type: "error",
        message: "Bạn không có quyền thực hiện thao tác này",
      };

    const isSlugTaken = await CourseModel.exists({ slug });

    if (isSlugTaken)
      return {
        type: "error",
        message: "Đường dẫn này đã tồn tại!",
      };

    const newVideo = await CourseModel.create({
      title,
      slug,
      type: CourseType.Video,
      author: currentAdmin._id,
      _destroy: false,
    });

    try {
      const newLecture = await LectureModel.create({
        title,
        courseId: newVideo._id,
        _destroy: false,
      });
      const newLesson = await LessonModel.create({
        title,
        slug,
        courseId: newVideo._id,
        lectureId: newLecture._id,
        _destroy: false,
      });

      await Promise.all([
        LectureModel.updateOne(
          { _id: newLecture._id },
          { $push: { lessons: newLesson._id } },
        ),
        CourseModel.updateOne(
          { _id: newVideo._id },
          { $push: { lecture: newLecture._id } },
        ),
      ]);
    } catch (error) {
      // Video thiếu chương hoặc bài thì không xem được: xóa phần đã tạo để tạo lại
      await Promise.all([
        CourseModel.deleteOne({ _id: newVideo._id }),
        LectureModel.deleteMany({ courseId: newVideo._id }),
        LessonModel.deleteMany({ courseId: newVideo._id }),
      ]);
      throw error;
    }

    await recordActivity({
      userId: currentAdmin._id,
      type: ActivityType.CreateCourse,
      courseId: newVideo._id,
      targetTitle: title,
      detail: "Video lẻ",
    });

    return {
      type: "success",
      message: "Đã tạo video",
    };
  } catch (error) {
    console.log(error);

    return {
      type: "error",
      message: "Chưa tạo được video, thử lại sau",
    };
  }
}

/** Dữ liệu trang sửa video lẻ, chỉ admin đọc được */
export async function fetchVideoUpdateData(
  slug: string,
): Promise<VideoUpdateData | undefined> {
  try {
    await connectToDatabase();
    const currentAdmin = await getCurrentAdmin();

    if (!currentAdmin) return;

    const video = await CourseModel.findOne({
      slug,
      type: CourseType.Video,
      _destroy: false,
    }).select(
      "title slug price salePrice intro desc image cta seoKeywords free level status category",
    );

    if (!video) return;

    const lesson = await LessonModel.findOne({
      courseId: video._id,
      _destroy: false,
    }).select("video assetId iframe content duration");

    if (!lesson) return;

    return parseData({ ...video.toObject(), lesson });
  } catch (error) {
    console.log(error);
  }
}

// generateMetadata và page trong cùng một request dùng chung một lần đọc
const findVideoBySlug = cache(async (slug: string) => {
  await connectToDatabase();

  return CourseModel.findOne({
    slug,
    type: CourseType.Video,
    _destroy: false,
  }).select(
    "title slug desc intro image price salePrice free cta level status seoKeywords",
  );
});

/**
 * Trang xem video lẻ. Người chưa có quyền xem chỉ nhận phần giới thiệu, không
 * nhận video và nội dung. Đang bán là trang công khai; ngừng bán chỉ người đã
 * mua và người quản lý; chờ duyệt, lưu trữ chỉ người quản lý.
 */
export async function fetchVideoDetails(
  slug: string,
): Promise<VideoDetailsData | undefined> {
  try {
    const video = await findVideoBySlug(slug);

    if (!video) return;

    const videoId = video._id.toString();
    const hasAccess = await canAccessCourseContent(videoId);

    if (video.status !== CourseStatus.Approved) {
      const canSeeHiddenVideo =
        video.status === CourseStatus.Rejected
          ? hasAccess
          : Boolean(await getCurrentCourseManager(videoId));

      if (!canSeeHiddenVideo) return;
    }

    const lesson = await LessonModel.findOne({
      courseId: video._id,
      _destroy: false,
    }).select("video iframe content duration");

    if (!lesson) return;

    const isFree = isCourseFree(video);
    // Video miễn phí xem được cả khi chưa đăng nhập, khi đó hasAccess là false
    const canWatch = isFree || hasAccess;
    const lessonData = canWatch
      ? lesson.toObject()
      : { _id: lesson._id, duration: lesson.duration };

    return parseData({
      ...video.toObject(),
      lesson: lessonData,
      isFree,
      canWatch,
    });
  } catch (error) {
    console.log(error);
  }
}

/** Video lẻ đang bán cho trang danh sách, mới nhất trước, kèm thời lượng của bài */
export async function fetchVideos({
  search,
  isFree,
  categorySlug,
  limit,
}: FetchVideosParams): Promise<VideoListItem[] | undefined> {
  try {
    await connectToDatabase();

    const matchQuery: FilterQuery<typeof CourseModel> = {
      type: CourseType.Video,
      status: CourseStatus.Approved,
      _destroy: false,
    };

    if (categorySlug) {
      const category = await CategoryModel.findOne({ slug: categorySlug })
        .select("_id")
        .lean<{ _id: Types.ObjectId }>();

      // Link lọc cũ trỏ tới danh mục đã xoá hoặc đổi đường dẫn: không có video nào khớp
      if (!category) return [];

      matchQuery.category = category._id;
    }

    if (search) {
      matchQuery.title = { $regex: escapeRegExp(search), $options: "i" };
    }

    // Cùng định nghĩa với isCourseFree: bật cờ free và giá 0
    if (isFree) {
      matchQuery.free = true;
      matchQuery.price = { $lte: 0 };
    }

    const videos = await CourseModel.aggregate<VideoListItem>([
      { $match: matchQuery },
      { $sort: { createdAt: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: LessonModel.collection.name,
          let: { videoId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$courseId", "$$videoId"] },
                _destroy: false,
              },
            },
            { $project: { duration: 1 } },
            { $limit: 1 },
          ],
          as: "lessons",
        },
      },
      {
        $project: {
          title: 1,
          slug: 1,
          image: 1,
          level: 1,
          rating: 1,
          price: 1,
          salePrice: 1,
          free: 1,
          createdAt: 1,
          duration: {
            $ifNull: [{ $arrayElemAt: ["$lessons.duration", 0] }, 0],
          },
        },
      },
    ]);

    return parseData(videos);
  } catch (error) {
    console.error("fetchVideos error:", error);
  }
}

/** Danh mục đang có video bán, cho hàng chip lọc ở trang danh sách video, xếp theo tên */
export async function fetchVideoCategories(): Promise<VideoCategoryOption[]> {
  try {
    await connectToDatabase();

    const categories = await CourseModel.aggregate<VideoCategoryOption>([
      {
        $match: {
          type: CourseType.Video,
          status: CourseStatus.Approved,
          _destroy: false,
          category: { $ne: null },
        },
      },
      { $group: { _id: "$category" } },
      {
        $lookup: {
          from: CategoryModel.collection.name,
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      { $project: { _id: 0, name: "$category.name", slug: "$category.slug" } },
      { $sort: { name: 1 } },
    ]);

    return parseData(categories);
  } catch (error) {
    console.error("fetchVideoCategories error:", error);

    return [];
  }
}
