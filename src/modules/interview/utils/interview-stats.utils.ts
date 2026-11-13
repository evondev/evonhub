import {
  INTERVIEW_LOW_CORRECT_MIN_LEARNERS,
  INTERVIEW_LOW_CORRECT_RATE,
} from "../constants";
import { InterviewQuestionStats } from "../types";

/** Phần trăm người đúng ở lượt đầu, làm tròn; chưa ai làm thì 0 */
export function getCorrectPercent({ learnerCount, correctCount }: InterviewQuestionStats): number {
  if (learnerCount === 0) return 0;

  return Math.round((correctCount / learnerCount) * 100);
}

/** "12 người làm · 33% đúng", chưa ai làm thì "Chưa ai làm" */
export function formatQuestionStats(stats: InterviewQuestionStats): string {
  if (stats.learnerCount === 0) return "Chưa ai làm";

  return `${stats.learnerCount} người làm · ${getCorrectPercent(stats)}% đúng`;
}

/**
 * Đủ người làm mà rất ít người đúng: có thể câu khó thật, cũng có thể đáp án sai
 * (AI hay đoán sai kết quả code), Admin nên đọc lại
 */
export function isLowCorrectRate({ learnerCount, correctCount }: InterviewQuestionStats): boolean {
  if (learnerCount < INTERVIEW_LOW_CORRECT_MIN_LEARNERS) return false;

  return correctCount / learnerCount < INTERVIEW_LOW_CORRECT_RATE;
}
