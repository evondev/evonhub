"use server";
import Lecture from "@/database/lecture.model";
import { recordActivity } from "@/modules/activity/services/activity.service";
import { ActivityType } from "@/shared/constants/activity.constants";
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
    const lecture = await Lecture.findById(lectureId).select("courseId title");

    if (!lecture) return;

    const courseManager = await getCurrentCourseManager(
      lecture.courseId?.toString(),
    );

    if (!courseManager) return;

    const lectureUpdate: Partial<UpdateLectureParams["data"]> = {};

    if (typeof data?.title === "string") lectureUpdate.title = data.title;
    if (typeof data?.order === "number") lectureUpdate.order = data.order;

    await Lecture.findByIdAndUpdate(lectureId, lectureUpdate);

    if (lectureUpdate.title && lectureUpdate.title !== lecture.title) {
      await recordActivity({
        userId: courseManager._id,
        type: ActivityType.UpdateLecture,
        courseId: lecture.courseId,
        targetTitle: lectureUpdate.title,
        detail: `Tên cũ: ${lecture.title}`,
      });
    }
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
    const lecture = await Lecture.findById(lectureId).select("courseId title");
    const lectureCourseId = lecture?.courseId?.toString();

    // courseId client gửi chỉ dùng để đối chiếu, quyền tính theo khóa thật của chương
    if (!lectureCourseId || lectureCourseId !== courseId?.toString()) return;

    const courseManager = await getCurrentCourseManager(lectureCourseId);

    if (!courseManager) return;

    await Lecture.findByIdAndUpdate(lectureId, { _destroy: true });
    await recordActivity({
      userId: courseManager._id,
      type: ActivityType.DeleteLecture,
      courseId: lectureCourseId,
      targetTitle: lecture?.title,
    });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
