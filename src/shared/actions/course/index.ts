"use server";

import CourseModel from "@/modules/course/models";
import { UserRole } from "@/shared/constants/user.constants";
import { connectToDatabase } from "@/shared/libs";
import { getCurrentStaff } from "@/shared/libs/auth";
import { CourseFilterOption } from "@/shared/types";
import { FilterQuery } from "mongoose";

/** Khoá cho bộ lọc "Khoá học" của các trang duyệt: admin mọi khoá, expert khoá của mình */
export async function fetchManagedCourseOptions(): Promise<
  CourseFilterOption[] | undefined
> {
  try {
    const currentStaff = await getCurrentStaff();

    if (!currentStaff) return;

    await connectToDatabase();

    const courseQuery: FilterQuery<typeof CourseModel> = { _destroy: false };

    if (currentStaff.role !== UserRole.Admin) {
      courseQuery.author = currentStaff._id;
    }

    const courses = await CourseModel.find(courseQuery)
      .select("title")
      .sort({ title: 1 });

    return courses.map((course) => ({
      id: course._id.toString(),
      title: course.title,
    }));
  } catch (error) {
    console.log(error);
  }
}
