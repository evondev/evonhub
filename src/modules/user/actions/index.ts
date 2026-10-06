"use server";

import CourseModel from "@/modules/course/models";
import { CourseItemData } from "@/modules/course/types";
import LectureModel from "@/modules/lecture/models";
import LessonModel from "@/modules/lesson/models";
import {
  CourseStatus,
  LEARNABLE_COURSE_STATUSES,
} from "@/shared/constants/course.constants";
import { UserRole, UserStatus } from "@/shared/constants/user.constants";
import { parseData, readFacetCount } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import {
  getCurrentAdmin,
  getCurrentCourseManager,
  getCurrentStaff,
  getCurrentUser,
} from "@/shared/libs/auth";
import HistoryModel from "@/shared/models/history.model";
import { UserInfoData, UserItemData } from "@/shared/types/user.types";
import { auth } from "@clerk/nextjs/server";
import { FilterQuery, isValidObjectId, Types } from "mongoose";
import { revalidatePath } from "next/cache";
import {
  PROFILE_PUBLIC_PATH,
  PROFILE_SAVE_ERROR_MESSAGE,
  PROFILE_USERNAME_RESERVED_MESSAGE,
  PROFILE_USERNAME_TAKEN_MESSAGE,
  profilePayoutSchema,
  profilePublicSchema,
  profileSocialSchema,
} from "../constants";
import UserModel from "../models";
import {
  CountByCourse,
  CourseProgress,
  FetchUsersProps,
  FirstLessonLink,
  ProfileSaveResult,
  UpdateMyProfileParams,
  UserCoursesContinueData,
} from "../types";
import {
  USER_MANAGE_LIST_FIELDS,
  USER_STATUS_FORBIDDEN_MESSAGE,
  USER_STATUS_NOT_FOUND_MESSAGE,
  USER_STATUS_SAVE_ERROR_MESSAGE,
  USER_STATUS_SELF_LOCK_MESSAGE,
} from "../constants/user-manage.constants";
import {
  UpdateUserStatusParams,
  UpdateUserStatusResult,
  UserManageCountFacet,
  UserManageTabCounts,
} from "../types/user-manage.types";
import { isReservedUsername } from "../utils";

/** Khóa đã mua của chính user đang đăng nhập. userId client gửi lên bị bỏ qua */
export async function fetchUserCourses({
  courseOnly,
}: {
  userId?: string;
  courseOnly?: boolean;
}): Promise<
  | {
      courses: CourseItemData[];
      lessons: { _id: string; slug: string }[];
    }
  | undefined
> {
  try {
    await connectToDatabase();

    const { userId: clerkId } = auth();

    if (!clerkId)
      return {
        courses: [],
        lessons: [],
      };

    // Tính năng hội viên đã bỏ: ai cũng chỉ thấy khóa mình đã mua
    const user = await UserModel.findOne({
      clerkId,
    }).populate({
      path: "courses",
      select: "title slug image rating level price salePrice views free",
      // Khóa đã ngừng bán vẫn phải hiện ở khu vực học tập của người đã mua,
      // nhưng khóa đã soft-delete thì không
      match: { status: { $in: LEARNABLE_COURSE_STATUSES }, _destroy: false },
    });
    const courses: CourseItemData[] = user?.courses || [];

    if (courseOnly) {
      return {
        courses: parseData(courses),
        lessons: [],
      };
    }

    const allPromise = Promise.all(
      courses.map(async (item) => {
        return LessonModel.find({ courseId: item._id, _destroy: false }).select(
          "slug",
        );
      }),
    );

    const lessons = await allPromise;

    return {
      courses: parseData(courses),
      lessons: parseData(lessons),
    };
  } catch (error) {}
}

interface FetchPublicUserCoursesProps {
  username: string;
}

/**
 * Danh sách "đang học" ở trang hồ sơ công khai: tra theo username, chỉ trả
 * field của thẻ khóa học và chỉ khóa đang mở bán
 */
export async function fetchPublicUserCourses({
  username,
}: FetchPublicUserCoursesProps): Promise<CourseItemData[] | undefined> {
  try {
    await connectToDatabase();

    if (!username) return [];

    const user = await UserModel.findOne({ username })
      .select("courses")
      .populate({
        path: "courses",
        select: "title slug image rating level price salePrice views free",
        match: { status: CourseStatus.Approved, _destroy: false },
      });
    const courses: CourseItemData[] = user?.courses || [];

    return parseData(courses);
  } catch (error) {
    console.log(error);
  }
}

export async function fetchUserById({
  userId,
}: {
  userId: string;
}): Promise<UserInfoData | null | undefined> {
  try {
    await connectToDatabase();
    if (!userId) return null;

    // Bản ghi đầy đủ có email, tài khoản ngân hàng: chỉ trả cho chính người đó.
    // clerkId lộ ở trang công khai, không kiểm thì ai cũng đọc được hồ sơ người khác
    const { userId: currentUserId } = auth();

    if (userId !== currentUserId) return null;

    // getCurrentUser có cache(): root layout và page trong cùng request đọc một lần
    const findUser = await getCurrentUser();

    if (!findUser?._id) return null;

    return parseData(findUser);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Tiến độ nhiều khóa bằng 2 truy vấn gộp (đếm bài đã học, đếm bài của khóa)
 * thay vì 2 truy vấn cho mỗi khóa. Kết quả cùng thứ tự với courseIds.
 */
async function computeCoursesProgress(
  userId: Types.ObjectId,
  courseIds: string[],
): Promise<CourseProgress[]> {
  // aggregate không tự ép kiểu như find: phải đổi sang ObjectId trước khi $match
  const courseObjectIds = courseIds.map(
    (courseId) => new Types.ObjectId(courseId),
  );

  const [historyCounts, lessonCounts] = await Promise.all([
    HistoryModel.aggregate<CountByCourse>([
      { $match: { user: userId, course: { $in: courseObjectIds } } },
      { $group: { _id: "$course", count: { $sum: 1 } } },
    ]),
    // Không đếm bài đã xoá, để tổng khớp với đề cương
    LessonModel.aggregate<CountByCourse>([
      { $match: { courseId: { $in: courseObjectIds }, _destroy: false } },
      { $group: { _id: "$courseId", count: { $sum: 1 } } },
    ]),
  ]);

  const historyCountByCourse = new Map(
    historyCounts.map((item) => [item._id.toString(), item.count]),
  );
  const lessonCountByCourse = new Map(
    lessonCounts.map((item) => [item._id.toString(), item.count]),
  );

  return courseIds.map((courseId) => {
    const lessonCount = lessonCountByCourse.get(courseId) ?? 0;
    // Lịch sử có thể còn bài đã xoá: không để vượt tổng số bài
    const current = Math.min(
      historyCountByCourse.get(courseId) ?? 0,
      lessonCount,
    );

    return {
      progress: lessonCount ? Math.ceil((current / lessonCount) * 100) : 0,
      current,
      total: lessonCount,
    };
  });
}

/** Tiến độ học của chính user đang đăng nhập. userId client gửi lên bị bỏ qua */
export async function fetchUserCourseProgress({
  courseId,
}: {
  userId?: string;
  courseId: string;
}): Promise<CourseProgress | undefined> {
  try {
    if (!isValidObjectId(courseId)) return;

    const currentUser = await getCurrentUser();

    if (!currentUser) return;

    const [courseProgress] = await computeCoursesProgress(currentUser._id, [
      courseId,
    ]);

    return courseProgress;
  } catch (error) {}
}

export async function fetchUsers({
  search,
  limit,
  page,
  isPaid,
  status,
  role,
}: FetchUsersProps): Promise<
  | {
      users: UserItemData[];
      total: number;
      tabCounts: UserManageTabCounts;
    }
  | undefined
> {
  try {
    // Chưa đăng nhập cũng trả null, không chỉ chặn user thường
    const currentAdmin = await getCurrentAdmin();

    if (!currentAdmin) return undefined;

    // Tìm kiếm và vai trò áp cho cả số đếm của từng tab; tab chỉ áp cho danh sách
    const baseQuery: FilterQuery<typeof UserModel> = {};
    const skip = (page - 1) * limit;

    if (search) {
      baseQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) baseQuery.role = role;

    const paidCourseIds = await CourseModel.find({
      _destroy: false,
      free: false,
    }).distinct("_id");
    // Điều kiện riêng của từng tab, cộng thêm vào baseQuery
    const paidCondition: FilterQuery<typeof UserModel> = {
      courses: { $in: paidCourseIds },
    };
    const lockedCondition: FilterQuery<typeof UserModel> = {
      status: UserStatus.Inactive,
    };
    const tabCondition: FilterQuery<typeof UserModel> = {};

    if (status) tabCondition.status = status;
    if (isPaid) tabCondition.courses = paidCondition.courses;

    const query: FilterQuery<typeof UserModel> = {
      ...baseQuery,
      ...tabCondition,
    };

    // Một aggregate đếm tổng và mọi tab thay vì bốn countDocuments: $match chung
    // quét một lần, mỗi nhánh $facet chỉ lọc thêm điều kiện của tab trên đúng các
    // user đó. Giá trị lọc là chuỗi hoặc ObjectId từ distinct, $match không cần ép kiểu
    const [users, [userCountFacet]] = await Promise.all([
      // Chỉ các cột trang quản lý hiện: không trả bank, password, permissions
      UserModel.find(query)
        .select(USER_MANAGE_LIST_FIELDS)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      UserModel.aggregate<UserManageCountFacet>([
        { $match: baseQuery },
        { $project: { _id: 0, status: 1, courses: 1 } },
        {
          $facet: {
            total: [{ $match: tabCondition }, { $count: "count" }],
            all: [{ $count: "count" }],
            paid: [{ $match: paidCondition }, { $count: "count" }],
            locked: [{ $match: lockedCondition }, { $count: "count" }],
          },
        },
      ]),
    ]);

    return {
      users: parseData(users),
      total: readFacetCount(userCountFacet?.total),
      tabCounts: {
        all: readFacetCount(userCountFacet?.all),
        paid: readFacetCount(userCountFacet?.paid),
        locked: readFacetCount(userCountFacet?.locked),
      },
    };
  } catch (error) {
    console.log(error);
  }
}

export async function fetchUsersByCourseId({
  courseId,
  isGetAll,
}: {
  courseId: string;
  isGetAll?: boolean;
}): Promise<UserItemData[] | undefined> {
  try {
    await connectToDatabase();

    // Lấy toàn bộ user chỉ admin được; học viên của một khóa thì admin hoặc
    // expert sở hữu khóa đó
    const currentManager = isGetAll
      ? await getCurrentAdmin()
      : await getCurrentCourseManager(courseId);

    if (!currentManager) return;

    const query: FilterQuery<typeof UserModel> = {};
    if (!isGetAll) {
      query.courses = courseId;
    }
    const users = await UserModel.find(query).select(
      "_id name username avatar email",
    );

    return parseData(users);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Bài đầu tiên của từng khóa theo thứ tự đề cương: chương nhỏ nhất có bài, rồi
 * bài nhỏ nhất. 2 truy vấn cho mọi khóa thay vì 1 truy vấn cho mỗi chương.
 * Kết quả cùng thứ tự với courseIds, null nếu khóa chưa có bài.
 */
async function findFirstLessons(
  courseIds: string[],
): Promise<(FirstLessonLink | null)[]> {
  const lectures = await LectureModel.find({
    courseId: { $in: courseIds },
    _destroy: false,
  })
    .sort({ order: 1 })
    .select("courseId lessons")
    .lean<{ courseId: Types.ObjectId; lessons: Types.ObjectId[] }[]>();

  const lessons = await LessonModel.find({
    _id: { $in: lectures.flatMap((lecture) => lecture.lessons) },
    _destroy: false,
  })
    .sort({ order: 1 })
    .select("_id slug")
    .lean<{ _id: Types.ObjectId; slug: string }[]>();

  // Thứ tự trong mảng lessons đã theo order: vị trí nhỏ hơn là bài đứng trước
  const lessonRankById = new Map(
    lessons.map((lesson, rank) => [lesson._id.toString(), rank]),
  );

  return courseIds.map((courseId) => {
    for (const lecture of lectures) {
      if (lecture.courseId.toString() !== courseId) continue;

      const lessonRanks = lecture.lessons
        .map((lessonId) => lessonRankById.get(lessonId.toString()))
        .filter((rank): rank is number => rank !== undefined);

      if (lessonRanks.length === 0) continue;

      const firstLesson = lessons[Math.min(...lessonRanks)];

      return { _id: firstLesson._id.toString(), slug: firstLesson.slug };
    }

    return null;
  });
}

/** Khóa đang học của chính user đang đăng nhập. userId client gửi lên bị bỏ qua */
export async function fetchUserCoursesContinue({
  limit = 3,
}: {
  userId?: string;
  limit?: number;
}): Promise<UserCoursesContinueData | undefined> {
  try {
    await connectToDatabase();

    const { userId: clerkId } = auth();

    if (!clerkId) return;

    // Tính năng hội viên đã bỏ: ai cũng chỉ thấy khóa mình đã mua
    const user = await UserModel.findOne({
      clerkId,
    })
      .select("courses")
      .populate({
        path: "courses",
        select: "title slug image rating level price salePrice views free",
        // Khóa đã ngừng bán vẫn phải hiện ở mục học tiếp, nhưng khóa đã
        // soft-delete thì không
        match: { status: { $in: LEARNABLE_COURSE_STATUSES }, _destroy: false },
        options: { limit },
      });

    if (!user) return;

    const courses: CourseItemData[] = user.courses || [];
    const courseIds = courses.map((course) => course._id.toString());
    const [lessons, progresses] = await Promise.all([
      findFirstLessons(courseIds),
      computeCoursesProgress(user._id, courseIds),
    ]);

    return {
      courses: parseData(courses),
      lessons,
      progresses,
    };
  } catch (error) {}
}

export async function fetchUserByUsername({
  username,
}: {
  username: string;
}): Promise<UserInfoData | null | undefined> {
  try {
    await connectToDatabase();

    const user = await UserModel.findOne({ username }).select(
      "username bio avatar _id createdAt",
    );

    if (!user) return null;

    return parseData(user);
  } catch (error) {
    console.log(error);
  }
}

export async function getUserByUsername(params: {
  username: string;
  email?: string;
}) {
  try {
    await connectToDatabase();

    // Trang cấp khóa tay: admin, và expert (đi từ trang quản lý đơn) cấp khóa của mình
    const currentStaff = await getCurrentStaff();

    if (!currentStaff) return;

    const { username, email } = params;
    const query: FilterQuery<typeof UserModel> = {};

    // String(): chặn object kiểu { $ne: "" } lọt vào bộ lọc Mongo
    if (username) query.username = String(username);

    if (email) query.email = String(email);

    // Không có điều kiện thì findOne trả user đầu bảng
    if (!query.username && !query.email) return;

    const user = await UserModel.findOne(query)
      .select("_id clerkId name username email avatar status role courses createdAt")
      // Chỉ các trường toCourseAccessCourse đọc
      .populate({
        path: "courses",
        model: CourseModel,
        select: "_id slug title image price free status",
      });

    return user;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Người đang đăng nhập tự sửa hồ sơ của mình, mọi vai đều được.
 * Chỉ ghi đúng các trường của khối đang lưu, kiểm lại dữ liệu ở server:
 * client gửi thêm trường khác (courses, permissions…) cũng bị bỏ.
 */
export async function updateMyProfile(
  params: UpdateMyProfileParams,
): Promise<ProfileSaveResult> {
  try {
    const { userId } = auth();

    if (!userId) {
      return {
        isSuccess: false,
        message: "Phiên đăng nhập đã hết, đăng nhập lại rồi thử lại",
      };
    }

    await connectToDatabase();
    const currentUser = await UserModel.findOne({ clerkId: userId }).select(
      "role username",
    );

    if (!currentUser)
      return { isSuccess: false, message: PROFILE_SAVE_ERROR_MESSAGE };

    let updateData: Record<string, unknown> = {};

    if (params.section === "public") {
      const parsed = profilePublicSchema.safeParse(params.values);

      if (!parsed.success) {
        return { isSuccess: false, message: parsed.error.issues[0]?.message };
      }

      // Chỉ kiểm khi đổi username: tên cũ đã lưu thì sửa họ tên vẫn được
      const isUsernameChanged = parsed.data.username !== currentUser.username;
      const isAdmin = currentUser.role === UserRole.Admin;

      if (
        isUsernameChanged &&
        !isAdmin &&
        isReservedUsername(parsed.data.username)
      ) {
        return {
          isSuccess: false,
          fieldErrors: { username: PROFILE_USERNAME_RESERVED_MESSAGE },
        };
      }

      // Không phân biệt hoa thường: "Evondev" và "evondev" là một
      const isUsernameTaken =
        isUsernameChanged &&
        (await UserModel.exists({
          username: parsed.data.username,
          clerkId: { $ne: userId },
        }).collation({ locale: "en", strength: 2 }));

      if (isUsernameTaken) {
        return {
          isSuccess: false,
          fieldErrors: { username: PROFILE_USERNAME_TAKEN_MESSAGE },
        };
      }

      updateData = { ...parsed.data };
    }

    if (params.section === "socials") {
      const parsed = profileSocialSchema.safeParse(params.values);

      if (!parsed.success) {
        return { isSuccess: false, message: parsed.error.issues[0]?.message };
      }

      updateData = { socials: parsed.data };
    }

    if (params.section === "payout") {
      if (currentUser.role === UserRole.User) {
        return {
          isSuccess: false,
          message: "Chỉ chuyên gia và admin có tài khoản nhận tiền",
        };
      }

      const parsed = profilePayoutSchema.safeParse(params.values);

      if (!parsed.success) {
        return { isSuccess: false, message: parsed.error.issues[0]?.message };
      }

      updateData = { bank: parsed.data };
    }

    await UserModel.updateOne({ clerkId: userId }, { $set: updateData });

    revalidatePath("/profile");
    revalidatePath(`${PROFILE_PUBLIC_PATH}/${currentUser.username}`);

    return { isSuccess: true };
  } catch (error) {
    console.error(error);

    return { isSuccess: false, message: PROFILE_SAVE_ERROR_MESSAGE };
  }
}

/** Admin khoá hoặc mở khoá một thành viên. Chỉ ghi trường status */
export async function updateUserStatus({
  userId,
  status,
}: UpdateUserStatusParams): Promise<UpdateUserStatusResult> {
  try {
    const currentAdmin = await getCurrentAdmin();

    if (!currentAdmin) {
      return { isSuccess: false, message: USER_STATUS_FORBIDDEN_MESSAGE };
    }

    const isKnownStatus = Object.values(UserStatus).includes(status);

    if (!isValidObjectId(userId) || !isKnownStatus) {
      return { isSuccess: false, message: USER_STATUS_NOT_FOUND_MESSAGE };
    }

    const isSelfLock =
      currentAdmin._id.toString() === userId && status === UserStatus.Inactive;

    if (isSelfLock) {
      return { isSuccess: false, message: USER_STATUS_SELF_LOCK_MESSAGE };
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, {
      $set: { status },
    });

    if (!updatedUser) {
      return { isSuccess: false, message: USER_STATUS_NOT_FOUND_MESSAGE };
    }

    return { isSuccess: true };
  } catch (error) {
    console.log(error);

    return { isSuccess: false, message: USER_STATUS_SAVE_ERROR_MESSAGE };
  }
}
