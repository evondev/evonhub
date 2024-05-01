"use server";
import Course, { ICourse } from "@/database/course.model";
import { CreateCourseParams, UpdateCourseParams } from "@/types";
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
    const course = await Course.create({
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
export async function updateCourse({ slug, updateData }: UpdateCourseParams) {
  try {
    connectToDatabase();
    await Course.findOneAndUpdate({ slug }, updateData, {
      new: true,
    });
    revalidatePath(`/admin/course/update?slug=${slug}`);
  } catch (error) {}
}
export async function getCourseBySlug(
  slug: string
): Promise<ICourse | undefined> {
  try {
    connectToDatabase();
    const course = await Course.findOne({ slug });
    return course;
  } catch (error) {}
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
    await Course.findOneAndDelete({ slug });
  } catch (error) {}
}
