"use server";
import Course from "@/database/course.model";
import { CreateCourseParams } from "@/types";
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
    console.log("course:", course);
    revalidatePath(path);
    return course;
  } catch (error) {
    console.log(error);
  }
}
