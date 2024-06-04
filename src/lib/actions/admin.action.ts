"use server";
import Course from "@/database/course.model";
import Lecture from "@/database/lecture.model";
import Lesson from "@/database/lesson.model";
import { CourseParams } from "@/types";
import { connectToDatabase } from "../mongoose";

export async function getCourseUpdateOutline(
  slug: string
): Promise<CourseParams | undefined> {
  try {
    connectToDatabase();
    const course = await Course.findOne({
      slug,
      _destroy: false,
    })
      .select("title slug")
      .populate({
        path: "lecture",
        select: "title",
        model: Lecture,
        match: { _destroy: false },
        populate: {
          path: "lessons",
          select: "title slug video assetId content duration lectureId",
          model: Lesson,
          match: { _destroy: false },
          sort: { order: 1 } as any,
        },
      });

    return course;
  } catch (error) {
    console.log("error:", error);
  }
}
