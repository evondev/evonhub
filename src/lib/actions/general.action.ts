"use server";
import Course from "@/database/course.model";
import Lecture from "@/database/lecture.model";
import Lesson from "@/database/lesson.model";
import User from "@/database/user.model";
import { CourseParams } from "@/types";
import { ECourseStatus } from "@/types/enums";
import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "../mongoose";

export async function getUserStudyCourse(): Promise<any | undefined> {
  try {
    connectToDatabase();
    const { userId } = auth();
    if (!userId) return [];
    const user = (await User.findOne({ clerkId: userId })
      .populate({
        path: "courses",
        select: "title slug image rating level price salePrice",
        match: { status: ECourseStatus.APPROVED },
      })
      .lean()) as any;

    const courses = user.courses;
    const allPromise = Promise.all(
      courses.map(async (item: any) => {
        return Lesson.find({ courseId: item._id }).select("slug").lean();
      })
    );
    const lessons = await allPromise;
    return {
      courses,
      lessons,
    };
  } catch (error) {}
}
interface IGetLessonContent {
  id: string;
  title: string;
  lessons: [
    {
      _id: string;
      title: string;
      slug: string;
    }
  ];
}
export async function getLessonDetailsContent({
  courseSlug,
}: {
  courseSlug: string;
}): Promise<IGetLessonContent[] | undefined> {
  try {
    connectToDatabase();
    const findCourse = (await Course.findOne({ slug: courseSlug })
      .select("_id")
      .lean()) as any;
    if (!findCourse) return [];
    const lectureList = await Lecture.find({ courseId: findCourse._id })
      .select("title lessons")
      .populate({
        path: "lessons",
        model: Lesson,
        select: "title slug",
      });
    return lectureList || [];
  } catch (error) {}
}

export async function getCourseDetailsBySlug(
  slug: string
): Promise<CourseParams | undefined> {
  try {
    connectToDatabase();
    let searchQuery: any = {};
    searchQuery.slug = slug;
    const course = await Course.findOne(searchQuery)
      .select(
        "title info desc level views intro image price salePrice status slug cta ctaLink seoKeywords"
      )
      .lean()
      .populate({
        path: "lecture",
        select: "title",
        match: { _destroy: false },
        options: { lean: true },
        populate: {
          path: "lessons",
          select: "title duration",
          model: Lesson,
          match: { _destroy: false },
          options: { lean: true },
        },
      });

    return course as any;
  } catch (error) {
    console.log("error:", error);
  }
}
