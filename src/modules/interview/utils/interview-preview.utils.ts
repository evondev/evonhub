import { PREVIEW_INTERVIEW_ANSWER_KEYS } from "../constants/interview-preview.constants";
import { SubmitInterviewAnswerInput, SubmitInterviewAnswerResult } from "../types";
import { isCorrectLogOrder } from "./interview-grading.utils";

const PREVIEW_POINTS = 2;

/** Trang xem trước chấm tại chỗ bằng đáp án giả, không gọi server */
export async function gradePreviewAnswer(
  input: SubmitInterviewAnswerInput,
): Promise<SubmitInterviewAnswerResult> {
  const answerKey = PREVIEW_INTERVIEW_ANSWER_KEYS[input.questionId];

  if (!answerKey) return { isSuccess: false, message: "Câu hỏi không còn nữa" };

  const isCorrect = answerKey.correctLogItems
    ? isCorrectLogOrder(answerKey.correctLogItems, input.logOrder || [])
    : input.selectedOptionId === answerKey.correctOptionId;

  return {
    isSuccess: true,
    feedback: {
      ...answerKey,
      attemptId: `preview-${input.questionId}`,
      isCorrect,
      isFirstAttempt: true,
      pointsAwarded: isCorrect ? PREVIEW_POINTS : 0,
    },
  };
}
