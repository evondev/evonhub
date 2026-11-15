import "server-only";

import { connectToDatabase } from "@/shared/libs/mongoose";
import { isValidObjectId } from "mongoose";
import { InterviewQuestionStatus } from "../constants/interview-enums";
import { InterviewQuestionModel } from "../models";

/**
 * Khóa đã có ít nhất một câu luyện phỏng vấn đã đăng chưa. Trang bài học dùng
 * để quyết định hiện nút "Luyện phỏng vấn". Lỗi thì coi như chưa có: thiếu nút
 * còn hơn làm hỏng cả trang học.
 *
 * Không kiểm tra quyền: chỉ gọi từ server sau khi đã biết người học sở hữu khóa.
 */
export async function hasPublishedInterviewQuestions(
  courseId: string,
): Promise<boolean> {
  if (!isValidObjectId(courseId)) return false;

  try {
    await connectToDatabase();

    const publishedQuestion = await InterviewQuestionModel.exists({
      course: courseId,
      status: InterviewQuestionStatus.Published,
    });

    return Boolean(publishedQuestion);
  } catch (error) {
    console.log("error:", error);

    return false;
  }
}
