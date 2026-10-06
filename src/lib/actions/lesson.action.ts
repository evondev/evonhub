"use server";
import Course from "@/database/course.model";
import Lecture from "@/database/lecture.model";
import Lesson from "@/database/lesson.model";
import { NotificationType } from "@/modules/notifications/constants/notification-type.constants";
import { sendNotification } from "@/modules/notifications/services/send-notification.service";
import { sanitizeHtml } from "@/shared/helpers";
import { getCurrentCourseManager } from "@/shared/libs/auth";
import { CreateLessonParams, DeleteLessonParams } from "@/types";
import { ECourseStatus } from "@/types/enums";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";

export async function addLesson({
  title,
  slug,
  video,
  content,
  type,
  order,
  lectureId,
  courseId,
  iframe,
}: CreateLessonParams) {
  try {
    await connectToDatabase();
    const findLecture = await Lecture.findOne({
      _id: lectureId,
      _destroy: false,
    });
    if (!findLecture?._id) {
      throw new Error("Lecture not found");
    }

    const lectureCourseId = findLecture.courseId?.toString();

    // courseId client gửi phải khớp khóa thật của chương, quyền tính theo khóa thật
    if (!lectureCourseId || lectureCourseId !== courseId?.toString()) return;

    const courseManager = await getCurrentCourseManager(lectureCourseId);

    if (!courseManager) return;

    const isSlugTaken = await Lesson.exists({
      slug,
      courseId: lectureCourseId,
    });

    const newLesson = new Lesson({
      title,
      video,
      content: typeof content === "string" ? sanitizeHtml(content) : content,
      type,
      order,
      iframe,
      lectureId: findLecture._id,
      courseId: lectureCourseId,
      _destroy: false,
      slug: isSlugTaken
        ? `${slug}-${new Date().getTime().toString().slice(-3)}`
        : slug,
    });
    await newLesson.save();
    // Trả id để trang nội dung chọn ngay bài vừa thêm
    const newLessonId = newLesson._id.toString();
    findLecture.lessons.push(newLesson._id);
    await findLecture.save();
    const course = await Course.findById(lectureCourseId).select(
      "title slug status",
    );
    revalidatePath(`/admin/course/content?slug=${course?.slug}`);
    if (!course || course.status !== ECourseStatus.APPROVED) return newLessonId;
    await sendNotification({
      type: NotificationType.NewLesson,
      data: {
        courseTitle: course.title,
        courseSlug: course.slug,
        lessonId: newLessonId,
        lessonTitle: newLesson.title,
      },
      isSendAll: true,
    });

    return newLessonId;
  } catch (error) {
    console.log(error);
  }
}
export async function deleteLesson({ lessonId, path }: DeleteLessonParams) {
  try {
    await connectToDatabase();
    const lesson = await Lesson.findById(lessonId).select("courseId");

    if (!lesson) return;

    const courseManager = await getCurrentCourseManager(
      lesson.courseId?.toString(),
    );

    if (!courseManager) return;

    await Lesson.findByIdAndUpdate(lessonId, { _destroy: true });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
export async function getLessonCount(
  courseId: string,
): Promise<number | undefined> {
  try {
    await connectToDatabase();
    // count all lessons in course
    const count = await Lesson.countDocuments({ courseId, _destroy: false });
    return count;
  } catch (error) {
    console.log(error);
  }
}
export async function getCourseIdByLesson(slug: string) {
  try {
    await connectToDatabase();
    const lesson = await Lesson.findOne({ slug });
    if (!lesson) return;
    return lesson.courseId;
  } catch (error) {
    console.log(error);
  }
}
export async function getAllLessonByCourseId(courseId: string) {
  try {
    await connectToDatabase();
    const lesson = await Lesson.find({ courseId }).select("title slug");
    if (!lesson) return [];
    return lesson;
  } catch (error) {
    console.log(error);
  }
}
export async function getAllLectureByCourseId(courseId: string) {
  try {
    await connectToDatabase();
    const lecture = await Lecture.find({ courseId }).select("title slug");
    if (!lecture) return [];
    return lecture;
  } catch (error) {
    console.log(error);
  }
}
