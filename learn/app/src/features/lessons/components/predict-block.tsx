"use client";

import { useLessonProgress } from "../hooks/use-lesson-progress";
import type { PredictStep } from "../types/lesson";
import ChoiceQuestion from "./choice-question";
import CodeView from "./code-view";
import MarkdownText from "./markdown-text";

interface PredictBlockProps {
  step: PredictStep;
}

export default function PredictBlock({ step }: PredictBlockProps) {
  const { steps, saveStep } = useLessonProgress();
  const committedAnswerId = steps[step.id]?.answerId;

  function handleCommit(optionId: string, isCorrect: boolean) {
    void saveStep(step.id, { isDone: true, answerId: optionId, isCorrect });
  }

  return (
    <div className="space-y-4">
      {step.intro && <MarkdownText content={step.intro} className="text-muted" />}
      {step.code && <CodeView code={step.code} />}
      <ChoiceQuestion question={step.question} committedAnswerId={committedAnswerId} onCommit={handleCommit} />
    </div>
  );
}
