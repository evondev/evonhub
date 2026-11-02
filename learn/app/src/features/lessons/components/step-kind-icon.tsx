import { cn } from "@/utils/cn";
import { stepKindStyles, stepToneClasses } from "../constants/step-kind-styles";
import type { LessonStepKind } from "../types/lesson";

interface StepKindIconProps {
  kind: LessonStepKind;
  // "cell": ô vuông nền nhạt cạnh tiêu đề bước. "bare": chỉ icon tô màu, dùng trong chip.
  variant?: "cell" | "bare";
}

export default function StepKindIcon({ kind, variant = "cell" }: StepKindIconProps) {
  const { icon: Icon, tone } = stepKindStyles[kind];

  if (variant === "bare") {
    return <Icon className={cn("size-3.5 shrink-0", stepToneClasses[tone].icon)} aria-hidden />;
  }

  return (
    <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", stepToneClasses[tone].cell)}>
      <Icon className="size-4" aria-hidden />
    </span>
  );
}
