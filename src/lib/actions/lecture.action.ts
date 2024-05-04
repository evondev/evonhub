"use server";
import Course from "@/database/course.model";
import Lecture from "@/database/lecture.model";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";

export async function updateLecture({
  lectureId,
  path,
  data,
}: {
  lectureId: string;
  path: string;
  data: {
    title: string;
    order?: number;
  };
}) {
  try {
    connectToDatabase();
    await Lecture.findByIdAndUpdate(lectureId, data);
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
export async function deleteLecture({
  lectureId,
  path,
  courseId,
}: {
  lectureId: string;
  path: string;
  courseId: string;
}) {
  try {
    connectToDatabase();
    const course = await Course.findById(courseId);

    if (!course) {
      throw new Error("Không tìm thấy khóa học");
    }
    await Lecture.findByIdAndDelete(lectureId);
    course.lecture = course.lecture.filter(
      (id: string) => id.toString() !== lectureId
    );
    await course.save();
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
