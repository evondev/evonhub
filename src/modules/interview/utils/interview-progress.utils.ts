import { InterviewQuestionProgress } from "../types";

interface AttemptOutcome {
  questionId: string;
  isCorrect: boolean;
}

/**
 * Tiến độ từng câu từ các lượt đã nộp: có lượt đúng là "correct", đã nộp mà chưa
 * lần nào đúng là "wrong", chưa nộp là không có trong map
 */
export function buildQuestionProgressMap(
  attempts: AttemptOutcome[],
): Map<string, InterviewQuestionProgress> {
  const progressMap = new Map<string, InterviewQuestionProgress>();

  for (const attempt of attempts) {
    if (attempt.isCorrect) {
      progressMap.set(attempt.questionId, "correct");
      continue;
    }

    if (!progressMap.has(attempt.questionId)) {
      progressMap.set(attempt.questionId, "wrong");
    }
  }

  return progressMap;
}

/** Câu nên mở khi vào trang: câu đầu chưa làm, hết thì câu sai đầu tiên, hết nữa thì câu đầu */
export function findStartQuestionIndex(
  progresses: InterviewQuestionProgress[],
): number {
  const todoIndex = progresses.indexOf("todo");

  if (todoIndex >= 0) return todoIndex;

  const wrongIndex = progresses.indexOf("wrong");

  return wrongIndex >= 0 ? wrongIndex : 0;
}

export function getProgressPercent(answeredCount: number, total: number) {
  if (!total) return 0;

  return Math.min(Math.round((answeredCount / total) * 100), 100);
}
