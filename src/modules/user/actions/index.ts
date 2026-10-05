"use server";

import CourseModel from "@/modules/course/models";
import { CourseItemData } from "@/modules/course/types";
import LectureModel from "@/modules/lecture/models";
import LessonModel from "@/modules/lesson/models";
import { LEARNABLE_COURSE_STATUSES } from "@/shared/constants/course.constants";
import { UserRole } from "@/shared/constants/user.constants";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import HistoryModel from "@/shared/models/history.model";
import { UserInfoData, UserItemData } from "@/shared/types/user.types";
import { auth } from "@clerk/nextjs/server";
import { FilterQuery } from "mongoose";
import UserModel from "../models";
import { FetchUsersProps } from "../types";

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

export async function fetchUsers({
  search,
  limit,
  page,
  isPaid,
}: FetchUsersProps): Promise<
  | {
      users: UserItemData[];
      total: number;
    }
  | undefined
> {
  try {
    connectToDatabase();

    const { userId } = auth();
    const findUser = await UserModel.findOne({ clerkId: userId });

    if (findUser && ![UserRole.Admin].includes(findUser?.role))
      return undefined;

    const query: FilterQuery<typeof UserModel> = {};
    const skip = (page - 1) * limit;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (isPaid) {
      query.courses = {
        $in: await CourseModel.find({ _destroy: false, free: false }).distinct(
          "_id",
        ),
      };
    }

    const users: UserItemData[] = await UserModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({
        createdAt: -1,
      });

    const totalUsers = await UserModel.countDocuments(query);

    return {
      users: parseData(users),
      total: totalUsers,
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
