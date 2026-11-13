import { Button } from "@/components/ui/button";
import { ToneBadge } from "@/shared/components/common";
import { cn } from "@/shared/utils";
import {
  INTERVIEW_DIFFICULTY_LABELS,
  INTERVIEW_STATUS_LABELS,
  INTERVIEW_TYPE_LABELS,
} from "../../../constants";
import { InterviewQuestionStatus } from "../../../constants/interview-enums";
import { InterviewAdminQuestion } from "../../../types";
import { formatQuestionStats, isLowCorrectRate } from "../../../utils";

interface QuestionQueueProps {
  title: string;
  questions: InterviewAdminQuestion[];
  selectedQuestionId: string;
  /** Đã có câu trên màn, đang tải tab hay từ khoá mới */
  isRefreshing: boolean;
  onSelect: (questionId: string) => void;
}

function hasUnverifiedQuote(question: InterviewAdminQuestion) {
  return question.sources.some((source) => source.quote && !source.isQuoteVerified);
}

/** Câu nháp chưa ai thấy thì thôi; đã đăng, hay từng có người làm, thì hiện */
function shouldShowStats(question: InterviewAdminQuestion) {
  return question.status === InterviewQuestionStatus.Published || question.stats.learnerCount > 0;
}

export function QuestionQueue({
  title,
  questions,
  selectedQuestionId,
  isRefreshing,
  onSelect,
}: QuestionQueueProps) {
  return (
    <section
      aria-busy={isRefreshing}
      className={cn(
        "min-w-0 rounded-2xl border border-border bg-surface p-2 transition-opacity lg:sticky lg:top-24",
        isRefreshing && "opacity-60",
      )}
    >
      <div className="flex items-center justify-between px-2.5 pb-2 pt-1.5">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <span className="text-sm text-muted">{questions.length} câu</span>
      </div>
      <ol className="scrollbar-auto-hide flex flex-col gap-1 lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto">
        {questions.map((question) => {
          const isSelected = question.id === selectedQuestionId;

          return (
            <li key={question.id}>
              <Button
                type="button"
                aria-current={isSelected ? "true" : undefined}
                onClick={() => onSelect(question.id)}
                className={cn(
                  "h-auto w-full flex-col items-start justify-start gap-1.5 whitespace-normal p-3 text-left font-normal",
                  isSelected && "bg-primary/10",
                  !isSelected && "hover:bg-item-hover",
                )}
              >
                <span
                  className={cn(
                    "line-clamp-2 text-sm",
                    isSelected && "font-medium text-primary-strong",
                    !isSelected && "text-foreground/90",
                  )}
                >
                  {question.prompt}
                </span>
                <span
                  className={cn(
                    "flex flex-wrap items-center gap-x-2 gap-y-1 text-xs",
                    isSelected && "text-primary-strong",
                    !isSelected && "text-muted",
                  )}
                >
                  {INTERVIEW_TYPE_LABELS[question.type]} · {INTERVIEW_DIFFICULTY_LABELS[question.difficulty]}
                  {shouldShowStats(question) && ` · ${formatQuestionStats(question.stats)}`}
                  {question.status === InterviewQuestionStatus.Published && (
                    <ToneBadge tone="success" label={INTERVIEW_STATUS_LABELS[question.status]} />
                  )}
                  {hasUnverifiedQuote(question) && <ToneBadge tone="error" label="Trích dẫn chưa khớp" />}
                  {isLowCorrectRate(question.stats) && <ToneBadge tone="warning" label="Ít người đúng" />}
                </span>
              </Button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
