"use server";

import { CourseStatus } from "@/shared/constants/course.constants";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import CourseModel from "../models";
import { CourseItemData, FetchCoursesParams } from "../types";

export async function fetchCourses(
  params: FetchCoursesParams
): Promise<CourseItemData[] | undefined> {
  try {
    connectToDatabase();
    let searchQuery: any = {};
    if (params.status) {
      searchQuery.status = params.status;
    }
    const courses = await CourseModel.find(searchQuery)
      .select("title slug image level rating price salePrice views free")
      .sort({ createdAt: -1 });
    return parseData(courses);
  } catch (error) {}
}

export async function fetchCoursesIncoming(): Promise<
  CourseItemData[] | undefined
> {
  try {
    connectToDatabase();
    const courses = await CourseModel.find({
      status: CourseStatus.Pending,
    })
      .select("title slug image level rating price salePrice views free")
      .sort({ createdAt: -1 });
    return parseData(courses);
  } catch (error) {}
}

export async function fetchCourseBySlug(
  slug: string
): Promise<CourseItemData | undefined> {
  try {
    connectToDatabase();
    let searchQuery: any = {};
    searchQuery.slug = slug;
    const course = await CourseModel.findOne(searchQuery).select(
      "title info desc level views intro image price salePrice status slug cta ctaLink seoKeywords free author"
    );
    if (!course) return undefined;

    return JSON.parse(JSON.stringify(course));
  } catch (error) {
    console.log("error:", error);
  }
}
