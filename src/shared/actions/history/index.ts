"use server";

import { recordActivity } from "@/modules/activity/services/activity.service";
import LessonModel from "@/modules/lesson/models";
import { ActivityType } from "@/shared/constants/activity.constants";
import { connectToDatabase } from "@/shared/libs";
import { canAccessCourseContent, getCurrentUser } from "@/shared/libs/auth";
import HistoryModel from "@/shared/models/history.model";

interface HandleCompleteLessonProps {
  lessonId: string;
  /** Bỏ qua ở server: luôn ghi cho user đang đăng nhập */
  userId?: string;
  courseId: string;
  isSingleton?: boolean;
}

/**
 * Đánh dấu / bỏ đánh dấu học xong một bài, để tính tiến độ khóa. Bảng xếp hạng
 * không tính ở đây: điểm là số phút xem thật (modules/leaderboard).
 * Chỉ tính bài thuộc khóa đã mua hoặc quản lý.
 */
export async function handleCompleteLesson({
  lessonId,
  courseId,
  isSingleton = false,
}: HandleCompleteLessonProps): Promise<boolean | undefined> {
  try {
    const currentUser = await getCurrentUser();

    // Chỉ nhận chuỗi id, chặn client gửi object toán tử Mongo như { $ne: null }
    if (!currentUser || typeof lessonId !== "string") return;

    if (typeof courseId !== "string" || !courseId) return;

    await connectToDatabase();

    const isLessonInCourse = await LessonModel.exists({
      _id: lessonId,
      courseId,
      _destroy: false,
    });

    if (!isLessonInCourse) return;

    const hasAccess = await canAccessCourseContent(courseId);

    if (!hasAccess) return;

    const userId = currentUser._id;
    const existHistory = await HistoryModel.findOne({
      lesson: lessonId,
      user: userId,
      course: courseId,
    });

    if (!existHistory) {
      await HistoryModel.create({
        user: userId,
        course: courseId,
        lesson: lessonId,
      });
      await recordActivity({
        userId,
        type: ActivityType.CompleteLesson,
        courseId,
        lessonId,
      });

      return true;
    } else if (!isSingleton) {
      await HistoryModel.findOneAndDelete({
        lesson: lessonId,
        user: userId,
        course: courseId,
      });

      return false;
    }
  } catch (error) {
    console.log("error:", error);
  }
}
