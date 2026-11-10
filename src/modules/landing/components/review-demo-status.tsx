import { cn } from "@/shared/utils";
import { reviewDemoPhaseStyles } from "../constants/review-demo.constants";
import { ReviewDemoPhase } from "../types";
import { ScrambleText } from "./scramble-text";

interface ReviewDemoStatusProps {
  phase: ReviewDemoPhase;
}

/** Nhãn trạng thái ở góc editor, đổi chữ kiểu giải mã mỗi khi sang nhịp mới */
export function ReviewDemoStatus({ phase }: ReviewDemoStatusProps) {
  const phaseStyle = reviewDemoPhaseStyles[phase];

  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wider ring-1 ring-inset transition-colors duration-300",
        phaseStyle.className,
      )}
    >
      <ScrambleText text={phaseStyle.label} />
    </span>
  );
}
