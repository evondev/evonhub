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
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import {
  getCurrentAdmin,
  getCurrentCourseManager,
  getCurrentStaff,
} from "@/shared/libs/auth";
import HistoryModel from "@/shared/models/history.model";
import { UserInfoData, UserItemData } from "@/shared/types/user.types";
import { auth } from "@clerk/nextjs/server";
import { FilterQuery, isValidObjectId } from "mongoose";
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
  FetchUsersProps,
  ProfileSaveResult,
  UpdateMyProfileParams,
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
    connectToDatabase();
    if (!userId) return null;

    // Bản ghi đầy đủ có email, tài khoản ngân hàng: chỉ trả cho chính người đó.
    // clerkId lộ ở trang công khai, không kiểm thì ai cũng đọc được hồ sơ người khác
    const { userId: currentUserId } = auth();

    if (userId !== currentUserId) return null;

    const findUser = await UserModel.findOne({ clerkId: userId });

    if (!findUser?._id) return null;

    return parseData(findUser);
  } catch (error) {
    console.log(error);
  }
}

/** Tiến độ học của chính user đang đăng nhập. userId client gửi lên bị bỏ qua */
export async function fetchUserCourseProgress({
  courseId,
}: {
  userId?: string;
  courseId: string;
}): Promise<
  | {
      progress: number;
      current: number;
      total: number;
    }
  | undefined
> {
  try {
    await connectToDatabase();

    const { userId: clerkId } = auth();

    if (!clerkId || !courseId) return;

    const currentUser = await UserModel.findOne({ clerkId }).select("_id");

    if (!currentUser) return;

    const [historyCount, lessonCount] = await Promise.all([
      HistoryModel.countDocuments({ user: currentUser._id, course: courseId }),
      // Không đếm bài đã xoá, để tổng khớp với đề cương
      LessonModel.countDocuments({ courseId, _destroy: false }),
    ]);
    // Lịch sử có thể còn bài đã xoá: không để vượt tổng số bài
    const current = Math.min(historyCount, lessonCount);

    return {
      progress: lessonCount ? Math.ceil((current / lessonCount) * 100) : 0,
      current,
      total: lessonCount,
    };
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
    const paidQuery = { ...baseQuery, courses: { $in: paidCourseIds } };
    const lockedQuery = { ...baseQuery, status: UserStatus.Inactive };

    const query: FilterQuery<typeof UserModel> = { ...baseQuery };

    if (status) query.status = status;
    if (isPaid) query.courses = { $in: paidCourseIds };

    const [users, totalUsers, allCount, paidCount, lockedCount] =
      await Promise.all([
        // Chỉ các cột trang quản lý hiện: không trả bank, password, permissions
        UserModel.find(query)
          .select(USER_MANAGE_LIST_FIELDS)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
        UserModel.countDocuments(query),
        UserModel.countDocuments(baseQuery),
        UserModel.countDocuments(paidQuery),
        UserModel.countDocuments(lockedQuery),
      ]);

    return {
      users: parseData(users),
      total: totalUsers,
      tabCounts: { all: allCount, paid: paidCount, locked: lockedCount },
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

/** Bài đầu tiên theo thứ tự đề cương: chương nhỏ nhất có bài, rồi bài nhỏ nhất */
async function findFirstLesson(courseId: string) {
  const lectures = await LectureModel.find({ courseId, _destroy: false })
    .sort({ order: 1 })
    .select("lessons")
    .populate({
      path: "lessons",
      select: "_id slug",
      match: { _destroy: false },
      options: { sort: { order: 1 }, perDocumentLimit: 1 },
    });
  const firstLecture = lectures.find((lecture) => lecture.lessons.length > 0);

  return firstLecture?.lessons[0] || null;
}

/** Khóa đang học của chính user đang đăng nhập. userId client gửi lên bị bỏ qua */
export async function fetchUserCoursesContinue({
  limit = 3,
}: {
  userId?: string;
  limit?: number;
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

    if (!clerkId) return;

    const findUser: UserItemData | null = await UserModel.findOne({
      clerkId,
    }).select("_id");

    if (!findUser) return;

    // Tính năng hội viên đã bỏ: ai cũng chỉ thấy khóa mình đã mua
    const user = await UserModel.findOne({
      clerkId,
    }).populate({
      path: "courses",
      select: "title slug image rating level price salePrice views free",
      // Khóa đã ngừng bán vẫn phải hiện ở mục học tiếp, nhưng khóa đã
      // soft-delete thì không
      match: { status: { $in: LEARNABLE_COURSE_STATUSES }, _destroy: false },
      options: { limit },
    });
    const courses: CourseItemData[] = user?.courses || [];
    const lessons = await Promise.all(
      courses.map((course) => findFirstLesson(course._id)),
    );

    return {
      courses: parseData(courses),
      lessons: parseData(lessons),
    };
  } catch (error) {}
}

export async function fetchUserByUsername({
  username,
}: {
  username: string;
}): Promise<UserInfoData | null | undefined> {
  try {
    connectToDatabase();

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
      .populate({
        path: "courses",
        model: CourseModel,
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
