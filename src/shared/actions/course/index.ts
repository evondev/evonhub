"use server";

import CourseModel from "@/modules/course/models";
import { CourseStatus } from "@/shared/constants/course.constants";
import { UserRole } from "@/shared/constants/user.constants";
import { connectToDatabase } from "@/shared/libs";
import { getCurrentStaff } from "@/shared/libs/auth";
import { CourseFilterOption, FetchManagedCourseOptionsParams } from "@/shared/types";
import { FilterQuery } from "mongoose";

/** Khoá cho bộ lọc "Khoá học" của các trang duyệt: admin mọi khoá, expert khoá của mình */
export async function fetchManagedCourseOptions({
  shouldHideArchived = false,
}: FetchManagedCourseOptionsParams = {}): Promise<
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

    if (shouldHideArchived) courseQuery.status = { $ne: CourseStatus.Archived };

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
