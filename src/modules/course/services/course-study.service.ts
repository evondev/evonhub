import "server-only";

import { getCurrentUser } from "@/shared/libs/auth";
import { connectToDatabase } from "@/shared/libs/mongoose";
import { isValidObjectId } from "mongoose";
import CourseModel from "../models";
import StudySessionModel from "../models/study-session.model";
import { buildStudyDayKey } from "../utils/study-count.utils";
import { canManageCourse } from "./course-permission.service";

const DUPLICATE_KEY_ERROR_CODE = 11000;

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === DUPLICATE_KEY_ERROR_CODE
  );
}

/**
 * Cộng một lượt học khi người đã đăng nhập vào học khóa hoặc xem video, mỗi
 * người tối đa một lượt mỗi khóa mỗi ngày. Người quản lý khóa (admin, tác giả)
 * mở để kiểm tra nên không tính; khách chưa đăng nhập không có ai để chống
 * đếm trùng nên cũng không tính.
 *
 * Chỉ gọi từ server sau khi đã kiểm tra quyền học. Không đặt trong file
 * "use server" để client không gọi thẳng được mà đẩy lượt học lên.
 */
export async function recordStudySession(courseId: string) {
  try {
    if (!isValidObjectId(courseId)) return;

    const currentUser = await getCurrentUser();

    if (!currentUser) return;

    const isCourseManager = await canManageCourse({
      role: currentUser.role,
      userId: currentUser._id,
      courseId,
    });

    if (isCourseManager) return;

    await connectToDatabase();

    const sessionKey = {
      course: courseId,
      user: currentUser._id,
      day: buildStudyDayKey(new Date()),
    };
    const upsertResult = await StudySessionModel.updateOne(
      sessionKey,
      { $setOnInsert: sessionKey },
      { upsert: true },
    );

    // Đã có phiên hôm nay: lượt này đã được tính
    if (upsertResult.upsertedCount === 0) return;

    await CourseModel.updateOne({ _id: courseId }, { $inc: { studyCount: 1 } });
  } catch (error) {
    // Request khác cùng lúc vừa tạo phiên hôm nay và đã cộng lượt
    if (isDuplicateKeyError(error)) return;

    console.error("recordStudySession error:", error);
  }
}
