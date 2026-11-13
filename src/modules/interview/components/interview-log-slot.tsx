import { Button } from "@/components/ui/button";
import { cn } from "@/shared/utils";
import { X } from "lucide-react";

interface InterviewLogSlotProps {
  position: number;
  /** Dòng log học viên đặt vào ô này; chưa đặt là undefined */
  text?: string;
  /** Ô trống kế tiếp: hiện lời nhắc chạm */
  isNextSlot: boolean;
  isSubmitted: boolean;
  /** Đã nộp: dòng đúng ở vị trí này */
  correctText?: string;
  onRemove?: () => void;
}

function getSlotClassName(isFilled: boolean, isSubmitted: boolean, isRightPlace: boolean) {
  return cn(
    "flex min-h-11 items-center gap-3 rounded-xl border px-3 py-2",
    !isFilled && "border-dashed border-border-strong text-sm text-muted",
    isFilled && !isSubmitted && "border-border-strong bg-surface",
    isFilled && isSubmitted && isRightPlace && "border-emerald-600 bg-emerald-50 dark:bg-emerald-500/15",
    isFilled && isSubmitted && !isRightPlace && "border-red-600 bg-red-50 dark:bg-red-500/15",
  );
}

export function InterviewLogSlot({
  position,
  text,
  isNextSlot,
  isSubmitted,
  correctText,
  onRemove,
}: InterviewLogSlotProps) {
  const isFilled = text !== undefined;
  const isRightPlace = isFilled && text === correctText;

  return (
    <li className={getSlotClassName(isFilled, isSubmitted, isRightPlace)}>
      <span className="w-5 shrink-0 text-right text-xs tabular-nums text-muted">
        {position + 1}
      </span>
      {isFilled && (
        <span className="min-w-0 flex-1 font-mono text-sm text-foreground [font-variant-ligatures:none]">
          {text}
          {isSubmitted && !isRightPlace && correctText && (
            <span className="ml-2 font-sans text-xs text-emerald-700 dark:text-emerald-400">
              đúng là {correctText}
            </span>
          )}
        </span>
      )}
      {!isFilled && isNextSlot && <span className="flex-1">Chạm log tiếp theo bên dưới</span>}
      {isFilled && !isSubmitted && onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 rounded-lg"
          aria-label={`Bỏ ${text}`}
          onClick={onRemove}
        >
          <X className="size-4" />
        </Button>
      )}
    </li>
  );
}
