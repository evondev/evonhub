"use server";
import Course from "@/database/course.model";
import Lesson from "@/database/lesson.model";
import { CourseParams } from "@/types";
import { connectToDatabase } from "../mongoose";

export async function getCourseUpdateOutline(
  slug: string
): Promise<CourseParams | undefined> {
  try {
    connectToDatabase();
    let searchQuery: any = {};
    searchQuery.slug = slug;
    const course = await Course.findOne(searchQuery)
      .select("title slug")
      .populate({
        path: "lecture",
        select: "title",
        match: { _destroy: false },
        populate: {
          path: "lessons",
          select: "title slug video assetId content duration",
          model: Lesson,
          match: { _destroy: false },
        },
      });

    return course;
  } catch (error) {
    console.log("error:", error);
  }
}
