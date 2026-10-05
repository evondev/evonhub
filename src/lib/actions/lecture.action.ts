"use server";
import Lecture from "@/database/lecture.model";
import { getCurrentCourseManager } from "@/shared/libs/auth";
import { DeleteLectureParams, UpdateLectureParams } from "@/types";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";

export async function updateLecture({
  lectureId,
  path,
  data,
}: UpdateLectureParams) {
  try {
    await connectToDatabase();
    const lecture = await Lecture.findById(lectureId).select("courseId");

    if (!lecture) return;

    const courseManager = await getCurrentCourseManager(
      lecture.courseId?.toString(),
    );

    if (!courseManager) return;

    const lectureUpdate: Partial<UpdateLectureParams["data"]> = {};

    if (typeof data?.title === "string") lectureUpdate.title = data.title;
    if (typeof data?.order === "number") lectureUpdate.order = data.order;

    await Lecture.findByIdAndUpdate(lectureId, lectureUpdate);
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
    await connectToDatabase();
    const lecture = await Lecture.findById(lectureId).select("courseId");
    const lectureCourseId = lecture?.courseId?.toString();

    // courseId client gửi chỉ dùng để đối chiếu, quyền tính theo khóa thật của chương
    if (!lectureCourseId || lectureCourseId !== courseId?.toString()) return;

    const courseManager = await getCurrentCourseManager(lectureCourseId);

    if (!courseManager) return;

    await Lecture.findByIdAndUpdate(lectureId, { _destroy: true });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
