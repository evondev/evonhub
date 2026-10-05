"use server";
import Course from "@/database/course.model";
import Lecture from "@/database/lecture.model";
import Lesson from "@/database/lesson.model";
import { getCurrentCourseManager } from "@/shared/libs/auth";
import { CourseParams } from "@/types";
import { connectToDatabase } from "../mongoose";

export async function getCourseUpdateOutline(
  slug: string
): Promise<CourseParams | undefined> {
  try {
    await connectToDatabase();
    const foundCourse = await Course.findOne({ slug, _destroy: false }).select(
      "_id"
    );

    if (!foundCourse) return;

    const courseManager = await getCurrentCourseManager(
      foundCourse._id.toString()
    );

    if (!courseManager) return;

    const course = await Course.findById(foundCourse._id)
      .select("title slug")
      .populate({
        path: "lecture",
        select: "title order _destroy",
        model: Lecture,
        match: { _destroy: false },
        options: { sort: { order: 1 } },
        populate: {
          path: "lessons",
          select:
            "title slug video assetId content duration lectureId order iframe trial _destroy",
          model: Lesson,
          match: { _destroy: false },
          options: { sort: { order: 1 } },
        },
      });

    return course;
  } catch (error) {
    console.log("error:", error);
  }
}
