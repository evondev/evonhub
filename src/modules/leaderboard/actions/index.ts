"use server";

import LessonModel from "@/modules/lesson/models";
import { connectToDatabase } from "@/shared/libs";
import { canAccessCourseContent, getCurrentUser } from "@/shared/libs/auth";
import { isValidObjectId } from "mongoose";
import { creditWatchBuckets } from "../services/study-time.service";
import { RecordWatchProgressParams, WatchableLesson } from "../types";
import {
  getLessonMaxBucketCount,
  isLeaderboardParticipant,
  sanitizeBuckets,
} from "../utils";

/**
 * Nhịp từ trình phát: các ô 10 giây vừa xem trọn của một bài. Chỉ tính bài
 * thuộc khoá người đó mở được thật (bài học thử của khoá chưa mua không tính),
 * và không tính admin, expert.
 */
export async function recordWatchProgress({
  lessonId,
  courseId,
  buckets,
}: RecordWatchProgressParams): Promise<void> {
  try {
    // Chỉ nhận chuỗi id, chặn client gửi object toán tử Mongo như { $ne: null }
    if (typeof lessonId !== "string" || !isValidObjectId(lessonId)) return;

    if (typeof courseId !== "string" || !isValidObjectId(courseId)) return;

    if (!Array.isArray(buckets) || buckets.length === 0) return;

    const currentUser = await getCurrentUser();

    if (!currentUser || !isLeaderboardParticipant(currentUser.role)) return;

    await connectToDatabase();

    const lesson = await LessonModel.findOne({
      _id: lessonId,
      courseId,
      _destroy: false,
    })
      .select("duration video")
      .lean<WatchableLesson>();

    if (!lesson) return;

    const validBuckets = sanitizeBuckets(
      buckets,
      getLessonMaxBucketCount(lesson),
    );

    if (validBuckets.length === 0) return;

    const hasAccess = await canAccessCourseContent(courseId);

    if (!hasAccess) return;

    await creditWatchBuckets({
      userId: currentUser._id,
      lessonId,
      courseId,
      buckets: validBuckets,
    });
  } catch (error) {
    console.log("[leaderboard] Ghi phút học lỗi:", error);
  }
}
