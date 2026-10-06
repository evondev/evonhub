"use server";
import Course from "@/database/course.model";
import Lecture from "@/database/lecture.model";
import Lesson from "@/database/lesson.model";
import User from "@/database/user.model";
import OrderModel from "@/modules/order/models";
import { EOrderStatus } from "@/types/enums";
import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "../mongoose";

interface IGetLessonContent {
  id: string;
  title: string;
  lessons: [
    {
      _id: string;
      title: string;
      slug: string;
      duration: number;
    }
  ];
}
export async function getLessonDetailsContent({
  courseSlug,
}: {
  courseSlug: string;
}): Promise<IGetLessonContent[] | undefined> {
  try {
    await connectToDatabase();
    const findCourse = await Course.findOne({ slug: courseSlug }).select("_id");
    if (!findCourse) return [];
    const lectureList = await Lecture.find({
      courseId: findCourse._id,
      _destroy: false,
    })
      .select("title lessons")
      .sort({ order: 1 })
      .populate({
        path: "lessons",
        model: Lesson,
        select: "_id title slug user course order duration",
        match: { _destroy: false },
        options: {
          sort: { order: 1 },
        },
      });
    return lectureList || [];
  } catch (error) {}
}

export async function countOverview() {
  try {
    await connectToDatabase();
    const { userId } = auth();
    const findUser = await User.findOne({ clerkId: userId });
    if (!findUser) return null;
    const userCourses = await Course.find({ author: findUser?._id });

    const course = userCourses.length;
    const user = await User.countDocuments({
      courses: { $in: userCourses.map((course) => course._id) },
    });
    const order = await OrderModel.countDocuments({
      status: EOrderStatus.APPROVED,
      course: { $in: userCourses.map((course) => course._id) },
    });
    const income = await OrderModel.aggregate([
      {
        $match: {
          status: EOrderStatus.APPROVED,
          course: { $in: userCourses.map((course) => course._id) },
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
