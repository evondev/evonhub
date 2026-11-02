"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { stepKindLabels } from "../constants/step-kind-labels";
import { useLessonProgress } from "../hooks/use-lesson-progress";
import type { LessonStep } from "../types/lesson";
import StepKindIcon from "./step-kind-icon";

interface StepChipNavProps {
  steps: LessonStep[];
}

// Các bước của trang thành một hàng chip ngay dưới tiêu đề: bố cục B dành cột phải cho bàn làm việc.
// Chip nào cũng nền trắng viền rõ (chip trong suốt trên nền xám đọc ra như bị khoá). Icon tô theo nhóm bước;
// đã xong thì thay bằng dấu ✓ xanh.
export default function StepChipNav({ steps: pageSteps }: StepChipNavProps) {
  const { steps } = useLessonProgress();

  return (
    <nav aria-label="Các bước" className="hidden flex-wrap gap-1 sm:flex">
      {pageSteps.map((step) => {
        const isDone = Boolean(steps[step.id]?.isDone);

        return (
          <Link
            key={step.id}
            href={`#${step.id}`}
            title={step.title}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong bg-surface px-2 py-1 text-xs text-foreground transition-colors hover:bg-button-hover"
          >
            {isDone && <Check className="size-3.5 text-emerald-700" aria-label="Đã xong" />}
            {!isDone && <StepKindIcon kind={step.kind} variant="bare" />}
            {stepKindLabels[step.kind]}
          </Link>
        );
      })}
    </nav>
  );
}
