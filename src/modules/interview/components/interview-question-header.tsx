import { INTERVIEW_DIFFICULTY_LABELS, INTERVIEW_POINTS_BY_DIFFICULTY, INTERVIEW_TYPE_LABELS } from "../constants";
import { InterviewPracticeQuestion } from "../types";

interface InterviewQuestionHeaderProps {
  question: InterviewPracticeQuestion;
}

const badgeClassName =
  "inline-flex items-center whitespace-nowrap rounded-full bg-foreground/5 px-2.5 py-1 text-xs font-medium text-foreground/70";

export function InterviewQuestionHeader({ question }: InterviewQuestionHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className={badgeClassName}>{INTERVIEW_TYPE_LABELS[question.type]}</span>
        <span className={badgeClassName}>
          {INTERVIEW_DIFFICULTY_LABELS[question.difficulty]} ·{" "}
          {INTERVIEW_POINTS_BY_DIFFICULTY[question.difficulty]} điểm
        </span>
        {question.tags.length > 0 && (
          <span className="hidden text-xs text-muted sm:inline">{question.tags.join(" · ")}</span>
        )}
      </div>
      <h2 className="text-pretty text-base font-semibold text-foreground">{question.prompt}</h2>
    </div>
  );
}
