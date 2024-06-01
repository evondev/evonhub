"use server";
import Course from "@/database/course.model";
import Lecture from "@/database/lecture.model";
import Lesson from "@/database/lesson.model";
import Order from "@/database/order.model";
import User from "@/database/user.model";
import { CourseParams } from "@/types";
import { ECourseStatus, EOrderStatus } from "@/types/enums";
import { connectToDatabase } from "../mongoose";

export async function getUserStudyCourse(
  userId: string
): Promise<any | undefined> {
  try {
    connectToDatabase();
    const user = await User.findOne({ clerkId: userId }).populate({
      path: "courses",
      select: "title slug image rating level price salePrice views free",
      match: { status: ECourseStatus.APPROVED },
    });

    const courses = user.courses;
    const allPromise = Promise.all(
      courses.map(async (item: any) => {
        return Lesson.find({ courseId: item._id, _destroy: false }).select(
          "slug"
        );
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
    const findCourse = await Course.findOne({ slug: courseSlug }).select("_id");
    if (!findCourse) return [];
    const lectureList = await Lecture.find({
      courseId: findCourse._id,
      _destroy: false,
    })
      .select("title lessons")
      .populate({
        path: "lessons",
        model: Lesson,
        select: "_id title slug user course",
        match: { _destroy: false },
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
        "_id title info desc level views intro image price salePrice status slug cta ctaLink seoKeywords free"
      )
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

    return course;
  } catch (error) {
    console.log("error:", error);
  }
}
export async function countOverview() {
  try {
    connectToDatabase();
    const course = await Course.countDocuments();
    const user = await User.countDocuments();
    const order = await Order.countDocuments({
      status: EOrderStatus.APPROVED,
    });
    const income = await Order.aggregate([
      {
        $match: {
          status: EOrderStatus.APPROVED,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
        },
      },
    ]);
    return {
      course,
      user,
      order,
      income,
    };
  } catch (error) {}
}
