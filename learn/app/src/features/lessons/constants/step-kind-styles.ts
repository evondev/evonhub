import { BookOpen, Bug, CircleHelp, FlaskConical, GraduationCap, MessageSquareText, SquareTerminal, Workflow } from "lucide-react";
import type { LessonStepKind } from "../types/lesson";
import type { StepKindStyle, StepTone, StepToneClasses } from "../types/step-tone";

export const stepKindStyles: Record<LessonStepKind, StepKindStyle> = {
  prose: { icon: BookOpen, tone: "xem" },
  "step-flow": { icon: Workflow, tone: "xem" },
  predict: { icon: CircleHelp, tone: "nghi" },
  "spot-bug": { icon: Bug, tone: "nghi" },
  "explain-back": { icon: MessageSquareText, tone: "nghi" },
  "code-task": { icon: SquareTerminal, tone: "lam" },
  acceptance: { icon: FlaskConical, tone: "lam" },
  "lab-link": { icon: GraduationCap, tone: "lam" },
};

// Sắc phân loại (luật P12 công thức B): cách xa tím của nút chính, không dùng xanh lá, hổ phách, đỏ
// vì ba màu đó đang nói đạt, chú ý, trượt.
export const stepToneClasses: Record<StepTone, StepToneClasses> = {
  xem: { cell: "bg-sky-100 text-sky-700", icon: "text-sky-600" },
  nghi: { cell: "bg-fuchsia-100 text-fuchsia-700", icon: "text-fuchsia-600" },
  lam: { cell: "bg-teal-100 text-teal-700", icon: "text-teal-600" },
};
