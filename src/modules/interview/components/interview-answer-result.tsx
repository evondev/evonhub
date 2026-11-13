import { CircleCheck, CircleX } from "lucide-react";
import { InterviewAnswerFeedback } from "../types";

interface InterviewAnswerResultProps {
  feedback: InterviewAnswerFeedback;
}

function getResultNote(feedback: InterviewAnswerFeedback) {
  if (feedback.isCorrect && feedback.pointsAwarded) return `+${feedback.pointsAwarded} điểm`;
  if (feedback.isCorrect) return "Câu này đã tính điểm từ lần trước";
  if (feedback.isFirstAttempt) return "Lần đầu sai nên câu này không cộng điểm. Làm lại vẫn được để nhớ.";

  return "Làm lại không cộng điểm, chỉ để nhớ.";
}

/** Dòng đầu sau khi nộp: đúng hay chưa, có cộng điểm không */
export function InterviewAnswerResult({ feedback }: InterviewAnswerResultProps) {
  if (feedback.isCorrect) {
    return (
      <div>
        <p className="flex items-center gap-2 text-base font-semibold text-emerald-700 dark:text-emerald-400">
          <CircleCheck className="size-5 shrink-0" />
          Đúng rồi
        </p>
        <p className="mt-1 text-sm text-muted">{getResultNote(feedback)}</p>
      </div>
    );
  }

  return (
    <div>
      <p className="flex items-center gap-2 text-base font-semibold text-red-700 dark:text-red-400">
        <CircleX className="size-5 shrink-0" />
        Chưa đúng
      </p>
      <p className="mt-1 text-pretty text-sm text-muted">{getResultNote(feedback)}</p>
    </div>
  );
}
