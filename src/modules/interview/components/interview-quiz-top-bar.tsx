import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/shared/components/common";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { INTERVIEW_PATH } from "../constants";
import { getProgressPercent } from "../utils";

interface InterviewQuizTopBarProps {
  courseTitle: string;
  currentNumber: number;
  totalQuestions: number;
  answeredCount: number;
  wrongCount: number;
  points: number;
}

export function InterviewQuizTopBar({
  courseTitle,
  currentNumber,
  totalQuestions,
  answeredCount,
  wrongCount,
  points,
}: InterviewQuizTopBarProps) {
  return (
    <div className="mb-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="icon" className="size-9 shrink-0">
          <Link href={INTERVIEW_PATH} aria-label="Về danh sách khóa">
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
        <p className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
          {courseTitle}
        </p>
        <span className="shrink-0 text-sm tabular-nums text-muted">
          Câu <b className="text-foreground">{currentNumber}</b>/{totalQuestions}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <ProgressBar
            progress={getProgressPercent(answeredCount, totalQuestions)}
            className="h-2 bg-foreground/5 dark:bg-foreground/5"
          />
        </div>
        <span className="shrink-0 text-xs tabular-nums text-foreground/70">
          {points} điểm · {wrongCount} câu sai
        </span>
      </div>
    </div>
  );
}
