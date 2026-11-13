"use client";

import { InterviewQuiz } from "../../components";
import { PREVIEW_INTERVIEW_SESSION } from "../../constants/interview-preview.constants";
import { gradePreviewAnswer } from "../../utils/interview-preview.utils";

/**
 * Xem trước màn làm bài bằng hai câu giả (đoán kết quả, sắp xếp log), chấm tại
 * chỗ. Không đọc hay ghi DB. Route chỉ mở ở dev
 */
export function InterviewQuizPreviewPage() {
  return <InterviewQuiz session={PREVIEW_INTERVIEW_SESSION} submitHandler={gradePreviewAnswer} />;
}
