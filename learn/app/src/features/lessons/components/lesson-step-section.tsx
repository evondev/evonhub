"use client";

import { CheckCircle2 } from "lucide-react";
import { stepKindLabels } from "../constants/step-kind-labels";
import { useLessonProgress } from "../hooks/use-lesson-progress";
import type { LessonStep } from "../types/lesson";
import LessonStepContent from "./lesson-step-content";
import StepKindIcon from "./step-kind-icon";

interface LessonStepSectionProps {
  step: LessonStep;
  stepNumber: number;
}

export default function LessonStepSection({ step, stepNumber }: LessonStepSectionProps) {
  const { steps } = useLessonProgress();
  const isDone = Boolean(steps[step.id]?.isDone);

  return (
    <section id={step.id} className="scroll-mt-24 space-y-4">
      <header className="flex items-start gap-3">
        <StepKindIcon kind={step.kind} />
        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2 text-xs font-medium text-muted">
            <span>
              {String(stepNumber).padStart(2, "0")} · {stepKindLabels[step.kind]}
            </span>
            {isDone && (
              <span className="inline-flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="size-3.5" aria-hidden />
                Xong
              </span>
            )}
          </div>
          <h2 className="text-lg font-semibold">{step.title}</h2>
        </div>
      </header>
      <LessonStepContent step={step} />
    </section>
  );
}
