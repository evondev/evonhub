"use server";

import LessonModel from "@/modules/lesson/models";
import ScoreModel from "@/modules/score/models";
import UserModel from "@/modules/user/models";
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
 * Đánh dấu / bỏ đánh dấu học xong một bài, kèm cộng / trừ điểm bảng xếp hạng.
 * Chỉ tính bài thuộc khóa đã mua hoặc quản lý (bài học thử không cộng điểm).
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
    const existScore = await ScoreModel.findOne({ user: userId });

    if (!existHistory) {
      await HistoryModel.create({
        user: userId,
        course: courseId,
        lesson: lessonId,
      });
      await UserModel.findByIdAndUpdate(userId, {
        $inc: { score: 10 },
      });
      if (!existScore) {
        await ScoreModel.create({
          user: userId,
          score: 10,
        });
      } else {
        await ScoreModel.findByIdAndUpdate(existScore._id, {
          $inc: { score: 10 },
        });
      }

      return true;
    } else if (!isSingleton) {
      await HistoryModel.findOneAndDelete({
        lesson: lessonId,
        user: userId,
        course: courseId,
      });
      if (existScore && existScore.score >= 10) {
        await UserModel.findByIdAndUpdate(userId, {
          $inc: { score: -10 },
        });
        await ScoreModel.findByIdAndUpdate(existScore._id, {
          $inc: { score: -10 },
        });
      }

      return false;
    }
  } catch (error) {
    console.log("error:", error);
  }
}
