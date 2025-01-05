"use server";

import { CourseItemData } from "@/modules/course/types";
import LessonModel from "@/modules/lesson/models";
import { CourseStatus } from "@/shared/constants/course.constants";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import UserModel from "../models";
import { UserItemData } from "../types";

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
}): Promise<UserItemData | null | undefined> {
  try {
    connectToDatabase();
    const findUser = await UserModel.findOne({ clerkId: userId });
    if (!findUser?._id) return null;

    return JSON.parse(JSON.stringify(findUser));
  } catch (error) {
    console.log(error);
  }
}
