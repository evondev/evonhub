"use server";

import CourseModel from "@/modules/course/models";
import { CourseItemData } from "@/modules/course/types";
import LectureModel from "@/modules/lecture/models";
import LessonModel from "@/modules/lesson/models";
import { LEARNABLE_COURSE_STATUSES } from "@/shared/constants/course.constants";
import { UserRole, UserStatus } from "@/shared/constants/user.constants";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import HistoryModel from "@/shared/models/history.model";
import { UserInfoData, UserItemData } from "@/shared/types/user.types";
import { auth } from "@clerk/nextjs/server";
import { FilterQuery, isValidObjectId } from "mongoose";
import {
  USER_STATUS_FORBIDDEN_MESSAGE,
  USER_STATUS_NOT_FOUND_MESSAGE,
  USER_STATUS_SAVE_ERROR_MESSAGE,
  USER_STATUS_SELF_LOCK_MESSAGE,
} from "../constants/user-manage.constants";
import UserModel from "../models";
import { FetchUsersProps } from "../types";
import {
  UpdateUserStatusParams,
  UpdateUserStatusResult,
  UserManageTabCounts,
} from "../types/user-manage.types";

export async function fetchUserCourses({
  userId,
  courseOnly,
}: {
  userId: string;
  courseOnly?: boolean;
}): Promise<
  | {
      courses: CourseItemData[];
      lessons: { _id: string; slug: string }[];
    }
  | undefined
> {
  try {
    connectToDatabase();

    if (!userId)
      return {
        courses: [],
        lessons: [],
      };

    const findUser: UserItemData | null = await UserModel.findOne({
      clerkId: userId,
    });

    if (!findUser) return;

    // Tính năng hội viên đã bỏ: ai cũng chỉ thấy khóa mình đã mua
    const user = await UserModel.findOne({
      clerkId: userId,
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

export async function fetchUserById({
  userId,
}: {
  userId: string;
}): Promise<UserInfoData | null | undefined> {
  try {
    connectToDatabase();
    if (!userId) return null;

    const findUser = await UserModel.findOne({ clerkId: userId });

    if (!findUser?._id) return null;

    return parseData(findUser);
  } catch (error) {
    console.log(error);
  }
}

export async function fetchUserCourseProgress({
  userId,
  courseId,
}: {
  userId: string;
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
    connectToDatabase();

    const [historyCount, lessonCount] = await Promise.all([
      HistoryModel.countDocuments({ user: userId, course: courseId }),
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

/** User đang đăng nhập nếu là admin; chưa đăng nhập hay không phải admin thì null */
async function findCurrentAdmin() {
  const { userId } = auth();

  if (!userId) return null;

  await connectToDatabase();

  const currentUser = await UserModel.findOne({ clerkId: userId });

  if (currentUser?.role !== UserRole.Admin) return null;

  return currentUser;
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
    const currentAdmin = await findCurrentAdmin();

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
        UserModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
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
    connectToDatabase();
    const query: FilterQuery<typeof UserModel> = {};
    if (!isGetAll) {
      query.courses = courseId;
    }
    const users = await UserModel.find(query);

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

export async function fetchUserCoursesContinue({
  userId,
  limit = 3,
}: {
  userId: string;
  limit?: number;
}): Promise<
  | {
      courses: CourseItemData[];
      lessons: { _id: string; slug: string }[];
    }
  | undefined
> {
  try {
    connectToDatabase();

    if (!userId) return;

    const findUser: UserItemData | null = await UserModel.findOne({
      clerkId: userId,
    });

    if (!findUser) return;

    // Tính năng hội viên đã bỏ: ai cũng chỉ thấy khóa mình đã mua
    const user = await UserModel.findOne({
      clerkId: userId,
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
      "username bio avatar clerkId _id createdAt",
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
    connectToDatabase();
    const { username, email } = params;
    const query: FilterQuery<typeof UserModel> = {};

    if (username) query.username = username;

    if (email) query.email = email;

    const user = await UserModel.findOne(query).populate({
      path: "courses",
      model: CourseModel,
    });

    return user;
  } catch (error) {
    console.log(error);
  }
}

/** Admin khoá hoặc mở khoá một thành viên. Chỉ ghi trường status */
export async function updateUserStatus({
  userId,
  status,
}: UpdateUserStatusParams): Promise<UpdateUserStatusResult> {
  try {
    const currentAdmin = await findCurrentAdmin();

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
