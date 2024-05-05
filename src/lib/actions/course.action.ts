"use server";
import Course, { ICourse } from "@/database/course.model";
import Lecture from "@/database/lecture.model";
import Lesson from "@/database/lesson.model";
import { CourseParams, CreateCourseParams, UpdateCourseParams } from "@/types";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";

export async function createCourse({
  title,
  slug,
  path,
  author,
}: CreateCourseParams) {
  try {
    connectToDatabase();
    const allCourse = await Course.find();
    const existSlug = allCourse.some((item) => item.slug === slug);
    if (existSlug) {
      return {
        type: "error",
        message: "Đường dẫn khóa học đã tồn tại!",
      };
    }
    await Course.create({
      title,
      slug,
      path,
      author,
    });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
export async function updateCourse({
  slug,
  updateData,
  path,
}: UpdateCourseParams) {
  try {
    connectToDatabase();
    const allCourse = await Course.find();
    const existSlug = allCourse.some((item) => item.slug === slug);
    if (existSlug) {
      return {
        type: "error",
        message: "Đường dẫn khóa học đã tồn tại!",
      };
    }
    await Course.findOneAndUpdate({ slug }, updateData, {
      new: true,
      upsert: true,
    });

    revalidatePath(path || `/admin/course/update?slug=${slug}`);
  } catch (error) {
    console.log("error:", error);
  }
}
export async function getCourseBySlug(
  slug: string
): Promise<ICourse | undefined> {
  try {
    connectToDatabase();
    const course = await Course.findOne({ slug }).populate({
      path: "lecture",
      populate: {
        path: "lessons",
        model: Lesson,
      },
    });
    return course;
  } catch (error) {
    console.log("error:", error);
  }
}
export async function getCourseById(
  id: string
): Promise<CourseParams | undefined> {
  try {
    connectToDatabase();
    const course = await Course.findById(id).populate({
      path: "lecture",
      populate: {
        path: "lessons",
        model: Lesson,
      },
    });
    return course;
  } catch (error) {
    console.log("error:", error);
  }
}

export async function getAllCourses(): Promise<ICourse[] | undefined> {
  try {
    connectToDatabase();
    const courses = await Course.find();
    return courses;
  } catch (error) {}
}
export async function deleteCourse(slug: string) {
  try {
    connectToDatabase();
    await Course.findOneAndUpdate(
      { slug },
      {
        status: "pending",
      }
    );
    revalidatePath("/admin/course/manage");
  } catch (error) {}
}
export async function updateCourseWithLecture(params: {
  title: string;
  courseId: string;
  order: number;
}) {
  try {
    connectToDatabase();
    const course = await Course.findById(params.courseId);

    if (!course) {
      throw new Error("Không tìm thấy khóa học");
    }
    const newLecture = new Lecture({
      ...params,
    });
    await newLecture.save();
    course.lecture.push(newLecture._id);
    await course.save();
  } catch (error) {
    console.log(error);
  }
}
