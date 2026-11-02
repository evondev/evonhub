"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/button";
import { cn } from "@/utils/cn";
import { useLessonProgress } from "../hooks/use-lesson-progress";
import type { StepFlowStep } from "../types/lesson";
import ChoiceQuestion from "./choice-question";
import CodeView from "./code-view";
import MarkdownText from "./markdown-text";
import StepFlowLane from "./step-flow-lane";

interface StepFlowBlockProps {
  step: StepFlowStep;
}

function getLaneGridClass(laneCount: number) {
  return cn("grid grid-cols-2 gap-3", laneCount === 3 && "md:grid-cols-3", laneCount >= 4 && "md:grid-cols-4");
}

export default function StepFlowBlock({ step }: StepFlowBlockProps) {
  const { steps, saveStep } = useLessonProgress();
  const [frameIndex, setFrameIndex] = useState(0);
  const [frameAnswers, setFrameAnswers] = useState<Record<number, string>>({});

  const frame = step.frames[frameIndex];
  const isLastFrame = frameIndex === step.frames.length - 1;
  const isWaitingForAnswer = Boolean(frame.question) && !frameAnswers[frameIndex];
  const isStepDone = Boolean(steps[step.id]?.isDone);

  function goToFrame(nextIndex: number) {
    setFrameIndex(nextIndex);

    if (nextIndex === step.frames.length - 1 && !isStepDone) {
      void saveStep(step.id, { isDone: true });
    }
  }

  function handleFrameAnswer(optionId: string) {
    setFrameAnswers((previousAnswers) => ({ ...previousAnswers, [frameIndex]: optionId }));
  }

  return (
    <div className="space-y-4">
      {step.intro && <MarkdownText content={step.intro} className="text-muted" />}

      <div className={cn(getLaneGridClass(step.lanes.length), "rounded-xl border border-border bg-surface p-3")}>
        {step.lanes.map((lane) => (
          <StepFlowLane key={lane.id} lane={lane} items={frame.lanes[lane.id] ?? []} focusItem={frame.focusItem} />
        ))}
      </div>

      <div className="rounded-xl border border-border-strong bg-surface p-4 sm:p-5">
        <div className="mb-2 text-xs font-medium text-muted">
          Bước {frameIndex + 1}/{step.frames.length}
        </div>
        <MarkdownText content={frame.caption} />
        {frame.question && (
          <div className="mt-4 border-t border-border-strong pt-4">
            <ChoiceQuestion
              key={frameIndex}
              question={frame.question}
              committedAnswerId={frameAnswers[frameIndex]}
              onCommit={handleFrameAnswer}
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button icon={ChevronLeft} disabled={frameIndex === 0} onClick={() => goToFrame(frameIndex - 1)}>
          Trước
        </Button>
        <div className="flex flex-1 justify-center gap-1" aria-hidden>
          {step.frames.map((frameItem, dotIndex) => (
            <span
              key={dotIndex}
              className={cn(
                "h-1.5 rounded-full transition-all",
                dotIndex === frameIndex && "w-4 bg-primary",
                dotIndex !== frameIndex && "w-1.5 bg-foreground/15",
              )}
            />
          ))}
        </div>
        {!isLastFrame && (
          <Button
            variant="primary"
            disabled={isWaitingForAnswer}
            onClick={() => goToFrame(frameIndex + 1)}
            className="flex-row-reverse"
            icon={ChevronRight}
          >
            {isWaitingForAnswer ? "Trả lời để đi tiếp" : "Tiếp"}
          </Button>
        )}
        {isLastFrame && (
          <Button icon={RotateCcw} onClick={() => goToFrame(0)}>
            Xem lại từ đầu
          </Button>
        )}
      </div>

      {step.code && <CodeView code={step.code} activeLines={frame.activeLines} />}
    </div>
  );
}
