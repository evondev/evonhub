import { Button } from "@/components/ui/button";
import { ArrowRight, RotateCcw } from "lucide-react";
import Link from "next/link";
import { INTERVIEW_PATH } from "../constants";

interface InterviewQuizActionsProps {
  isSubmitted: boolean;
  isCorrect: boolean;
  canSubmit: boolean;
  isSubmitting: boolean;
  isLastQuestion: boolean;
  onSkip: () => void;
  onSubmit: () => void;
  onRetry: () => void;
  onNext: () => void;
}

export function InterviewQuizActions({
  isSubmitted,
  isCorrect,
  canSubmit,
  isSubmitting,
  isLastQuestion,
  onSkip,
  onSubmit,
  onRetry,
  onNext,
}: InterviewQuizActionsProps) {
  if (!isSubmitted) {
    return (
      <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
        {isLastQuestion ? (
          <span />
        ) : (
          <Button variant="ghost" className="h-11 md:h-10" onClick={onSkip}>
            Bỏ qua
          </Button>
        )}
        <Button
          variant="primary"
          className="h-11 px-6 md:h-10"
          disabled={!canSubmit}
          isLoading={isSubmitting}
          onClick={onSubmit}
        >
          Nộp bài
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-4">
      {!isCorrect && (
        <Button variant="outline" className="h-11 md:h-10" onClick={onRetry}>
          <RotateCcw className="size-4" />
          Làm lại
        </Button>
      )}
      {isLastQuestion ? (
        <Button asChild variant="primary" className="h-11 md:h-10">
          <Link href={INTERVIEW_PATH}>Về danh sách khóa</Link>
        </Button>
      ) : (
        <Button variant="primary" className="h-11 md:h-10" onClick={onNext}>
          Câu tiếp
          <ArrowRight className="size-4" />
        </Button>
      )}
    </div>
  );
}
