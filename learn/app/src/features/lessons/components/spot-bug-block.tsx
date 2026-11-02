"use client";

import { useState } from "react";
import { FileCode2, RotateCcw, SearchCheck } from "lucide-react";
import { Button } from "@/components/button";
import { cn } from "@/utils/cn";
import { useLessonProgress } from "../hooks/use-lesson-progress";
import type { SpotBugStep } from "../types/lesson";
import { highlightCodeLines } from "../utils/highlight-code";
import MarkdownText from "./markdown-text";
import SpotBugLine from "./spot-bug-line";

interface SpotBugBlockProps {
  step: SpotBugStep;
}

function isSameLineSet(firstLines: number[], secondLines: number[]) {
  return firstLines.length === secondLines.length && firstLines.every((lineNumber) => secondLines.includes(lineNumber));
}

export default function SpotBugBlock({ step }: SpotBugBlockProps) {
  const { steps, saveStep } = useLessonProgress();
  const savedStep = steps[step.id];
  const [selectedLines, setSelectedLines] = useState<number[]>(savedStep?.selectedLines ?? []);
  const [isChecked, setIsChecked] = useState(Boolean(savedStep?.selectedLines));

  const highlightedLines = highlightCodeLines(step.code.source);
  const isAllCorrect = isSameLineSet(selectedLines, step.bugLines);
  const notedLines = Object.keys(step.lineNotes)
    .map(Number)
    .filter((lineNumber) => step.bugLines.includes(lineNumber) || selectedLines.includes(lineNumber));

  function handleToggleLine(lineNumber: number) {
    setSelectedLines((previousLines) =>
      previousLines.includes(lineNumber)
        ? previousLines.filter((selectedLine) => selectedLine !== lineNumber)
        : [...previousLines, lineNumber],
    );
  }

  function handleCheck() {
    setIsChecked(true);
    void saveStep(step.id, { isDone: true, selectedLines, isCorrect: isAllCorrect });
  }

  function handleRetry() {
    setIsChecked(false);
    setSelectedLines([]);
  }

  return (
    <div className="space-y-4">
      <MarkdownText content={step.prompt} />

      <div className="overflow-hidden rounded-xl border border-border-strong bg-surface">
        <div className="flex items-center gap-2 border-b border-border-strong px-4 py-2 text-xs text-muted">
          <FileCode2 className="size-3.5 shrink-0" aria-hidden />
          <span className="font-mono">{step.code.fileName}</span>
        </div>
        <div className="flex flex-col overflow-x-auto py-3">
          {highlightedLines.map((lineHtml, lineIndex) => (
            <SpotBugLine
              key={lineIndex}
              lineNumber={lineIndex + 1}
              lineHtml={lineHtml}
              isSelected={selectedLines.includes(lineIndex + 1)}
              isChecked={isChecked}
              isBug={step.bugLines.includes(lineIndex + 1)}
              onToggle={handleToggleLine}
            />
          ))}
        </div>
      </div>

      {!isChecked && (
        <div className="flex items-center gap-3">
          <Button variant="primary" icon={SearchCheck} disabled={selectedLines.length === 0} onClick={handleCheck}>
            Kiểm tra
          </Button>
          <span className="text-xs text-muted">Đã chọn {selectedLines.length} dòng.</span>
        </div>
      )}

      {isChecked && (
        <div className="space-y-3 rounded-xl border border-border-strong bg-surface p-4 sm:p-5">
          <p
            className={cn(
              "text-sm font-medium",
              isAllCorrect && "text-emerald-700",
              !isAllCorrect && "text-red-700",
            )}
          >
            {isAllCorrect ? "Chính xác, bro tìm đủ các dòng có vấn đề." : "Chưa đúng hết. Xem ghi chú từng dòng bên dưới."}
          </p>
          <ul className="space-y-2">
            {notedLines.map((lineNumber) => (
              <li key={lineNumber} className="flex gap-3 text-sm">
                <span className="w-14 shrink-0 font-mono text-xs leading-6 text-muted">Dòng {lineNumber}</span>
                <MarkdownText content={step.lineNotes[lineNumber]} />
              </li>
            ))}
          </ul>
          <MarkdownText content={step.summary} className="border-t border-border-strong pt-3 text-muted" />
          {!isAllCorrect && (
            <Button icon={RotateCcw} onClick={handleRetry}>
              Chọn lại
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
