"use server";
import Course from "@/database/course.model";
import Lecture from "@/database/lecture.model";
import { DeleteLectureParams, UpdateLectureParams } from "@/types";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";

export async function updateLecture({
  lectureId,
  path,
  data,
}: UpdateLectureParams) {
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
}: DeleteLectureParams) {
  try {
    connectToDatabase();
    const course = await Course.findById(courseId);

    if (!course) {
      throw new Error("Không tìm thấy khóa học");
    }
    await Lecture.findByIdAndUpdate(lectureId, { _destroy: true });
    // course.lecture = course.lecture.filter(
    //   (id: string) => id.toString() !== lectureId
    // );
    // await course.save();
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
