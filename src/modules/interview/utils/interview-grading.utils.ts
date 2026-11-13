import { INTERVIEW_POINTS_BY_DIFFICULTY } from "../constants";
import { InterviewDifficulty } from "../constants/interview-enums";

interface GradableOption {
  id: string;
  isCorrect: boolean;
}

interface AttemptPointsParams {
  difficulty: InterviewDifficulty;
  isCorrect: boolean;
  isFirstAttempt: boolean;
}

/** Đáp án đã chọn có phải đáp án đúng không */
export function isCorrectChoice(
  options: GradableOption[],
  selectedOptionId: string,
): boolean {
  const selectedOption = options.find((option) => option.id === selectedOptionId);

  return Boolean(selectedOption?.isCorrect);
}

/**
 * Thứ tự học viên chọn có đúng không. So theo chữ của từng dòng chứ không theo vị
 * trí: hai dòng log giống hệt nhau (StrictMode in hai lần) đổi chỗ cho nhau vẫn đúng
 */
export function isCorrectLogOrder(
  logItems: string[],
  logOrder: number[],
): boolean {
  if (logOrder.length !== logItems.length) return false;

  const usedIndexes = new Set(logOrder);

  if (usedIndexes.size !== logItems.length) return false;

  return logOrder.every((itemIndex, position) => {
    const isKnownIndex = Number.isInteger(itemIndex) && itemIndex >= 0 && itemIndex < logItems.length;

    return isKnownIndex && logItems[itemIndex] === logItems[position];
  });
}

/** Chỉ lượt đầu mà đúng mới được điểm, theo độ khó */
export function getAttemptPoints({
  difficulty,
  isCorrect,
  isFirstAttempt,
}: AttemptPointsParams): number {
  if (!isCorrect || !isFirstAttempt) return 0;

  return INTERVIEW_POINTS_BY_DIFFICULTY[difficulty] ?? 0;
}
