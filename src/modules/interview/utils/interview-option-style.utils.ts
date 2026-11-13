import { cn } from "@/shared/utils";

export type InterviewOptionVisualState =
  | "idle"
  | "selected"
  | "correct"
  | "wrong"
  | "dimmed";

interface OptionVisualStateParams {
  optionId: string;
  selectedOptionId: string;
  /** Đã nộp thì có id đáp án đúng; chưa nộp là undefined */
  correctOptionId?: string;
  isSubmitted: boolean;
}

/** Đáp án hiện ra sao: chưa nộp thì chỉ có đang chọn; nộp rồi thì đúng xanh, chọn sai đỏ, còn lại mờ */
export function getOptionVisualState({
  optionId,
  selectedOptionId,
  correctOptionId,
  isSubmitted,
}: OptionVisualStateParams): InterviewOptionVisualState {
  const isSelected = optionId === selectedOptionId;

  if (!isSubmitted) return isSelected ? "selected" : "idle";
  if (optionId === correctOptionId) return "correct";
  if (isSelected) return "wrong";

  return "dimmed";
}

export function getOptionClassName(visualState: InterviewOptionVisualState) {
  return cn(
    "h-auto min-h-12 w-full justify-start gap-3 whitespace-normal border px-3 py-2.5 text-left text-foreground disabled:opacity-100",
    visualState === "idle" && "border-border-strong bg-surface hover:bg-button-hover",
    visualState === "selected" && "border-primary bg-primary/5 ring-2 ring-primary/15",
    visualState === "correct" && "border-emerald-600 bg-emerald-50 dark:bg-emerald-500/15",
    visualState === "wrong" && "border-red-600 bg-red-50 dark:bg-red-500/15",
    visualState === "dimmed" && "border-border-strong bg-surface opacity-60 disabled:opacity-60",
  );
}

export function getOptionMarkerClassName(visualState: InterviewOptionVisualState) {
  return cn(
    "grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold",
    visualState === "selected" && "bg-primary text-primary-foreground",
    visualState === "correct" && "bg-emerald-600 text-white",
    visualState === "wrong" && "bg-red-600 text-white",
    (visualState === "idle" || visualState === "dimmed") && "border border-border-strong text-foreground/70",
  );
}
