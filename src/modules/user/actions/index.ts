"use server";

import { CourseItemData } from "@/modules/course/types";
import LessonModel from "@/modules/lesson/models";
import { CourseStatus } from "@/shared/constants/course.constants";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import HistoryModel from "@/shared/models/history.model";
import { UserInfoData, UserItemData } from "@/shared/types/user.types";
import UserModel from "../models";

export async function fetchUserCourses({ userId }: { userId: string }): Promise<
  | {
      courses: CourseItemData[];
      lessons: any[];
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
    const user: UserItemData = await UserModel.findOne({
      clerkId: userId,
    }).populate({
      path: "courses",
      select: "title slug image rating level price salePrice views free",
      match: { status: CourseStatus.Approved },
    });

    const courses = user.courses;
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
    const findUser = await UserModel.findOne({ clerkId: userId });
    if (!findUser?._id) return null;

    return JSON.parse(JSON.stringify(findUser));
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
}): Promise<number | undefined> {
  try {
    connectToDatabase();
    const historyCount = await HistoryModel.countDocuments({
      user: userId,
      course: courseId,
    });
    const lessonCount = await LessonModel.countDocuments({ courseId });
    return Math.ceil((historyCount / lessonCount) * 100);
  } catch (error) {}
}
