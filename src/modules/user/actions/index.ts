"use server";

import CourseModel from "@/modules/course/models";
import { CourseItemData } from "@/modules/course/types";
import LessonModel from "@/modules/lesson/models";
import { CourseStatus } from "@/shared/constants/course.constants";
import { UserRole } from "@/shared/constants/user.constants";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import HistoryModel from "@/shared/models/history.model";
import { UserInfoData, UserItemData } from "@/shared/types/user.types";
import { handleCheckMembership } from "@/shared/utils";
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

    const isMembership = handleCheckMembership({
      isMembership: findUser?.isMembership,
      endDate: findUser?.planEndDate || new Date().toISOString(),
    });

    let courses: CourseItemData[] = [];

    if (isMembership) {
      courses = await CourseModel.find({
        status: CourseStatus.Approved,
      }).select("title slug image rating level price salePrice views free");
    } else {
      const user = await UserModel.findOne({
        clerkId: userId,
      }).populate({
        path: "courses",
        select: "title slug image rating level price salePrice views free",
        match: { status: CourseStatus.Approved },
      });
      courses = user?.courses || [];
    }

    if (courseOnly) {
      return {
        courses: parseData(courses),
        lessons: [],
      };
    }

    const allPromise = Promise.all(
      courses.map(async (item) => {
        return LessonModel.find({ courseId: item._id, _destroy: false }).select(
          "slug"
        );
      })
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

    const historyCount = await HistoryModel.countDocuments({
      user: userId,
      course: courseId,
    });

    const lessonCount = await LessonModel.countDocuments({ courseId });

    return {
      progress: Math.ceil((historyCount / lessonCount) * 100),
      current: historyCount,
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
          "_id"
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

    const isMembership = handleCheckMembership({
      isMembership: findUser?.isMembership,
      endDate: findUser?.planEndDate || new Date().toISOString(),
    });

    let courses: CourseItemData[] = [];

    if (isMembership) {
      courses = await CourseModel.find({
        status: CourseStatus.Approved,
      })
        .select("title slug image rating level price salePrice views free")
        .limit(limit);
    } else {
      const user = await UserModel.findOne({
        clerkId: userId,
      }).populate({
        path: "courses",
        select: "title slug image rating level price salePrice views free",
        match: { status: CourseStatus.Approved },
        options: { limit },
      });
      courses = user?.courses;
    }

    const allLessonsPromises = Promise.all(
      courses.map(async (item) => {
        return LessonModel.findOne({
          courseId: item._id,
          _destroy: false,
        }).select("_id slug");
      })
    );

    const lessons = await allLessonsPromises;

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
      "isMembership planEndDate username bio avatar clerkId _id createdAt"
    );

    if (!user) return null;

    return parseData(user);
  } catch (error) {
    console.log(error);
  }
}
