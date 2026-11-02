"use client";

import { useState } from "react";
import { CheckSquare2, Square } from "lucide-react";
import { Button } from "@/components/button";
import { cn } from "@/utils/cn";
import MarkdownText from "./markdown-text";

interface KeyPointChecklistProps {
  keyPoints: string[];
}

export default function KeyPointChecklist({ keyPoints }: KeyPointChecklistProps) {
  const [checkedPoints, setCheckedPoints] = useState<string[]>([]);

  function handleTogglePoint(keyPoint: string) {
    setCheckedPoints((previousPoints) =>
      previousPoints.includes(keyPoint)
        ? previousPoints.filter((checkedPoint) => checkedPoint !== keyPoint)
        : [...previousPoints, keyPoint],
    );
  }

  return (
    <div className="space-y-2 rounded-xl border border-border-strong bg-surface p-4 sm:p-5">
      <p className="text-sm font-medium">Tự đối chiếu: bài giải thích của bro đã có những ý này chưa?</p>
      <p className="text-xs text-muted">
        Thiếu ý nào thì sửa bài rồi lưu lại. Ý nào chưa hiểu, mở Claude Code hỏi: nó đọc được journal/ của bro.
      </p>
      <ul className="flex flex-col gap-1">
        {keyPoints.map((keyPoint) => {
          const isChecked = checkedPoints.includes(keyPoint);

          return (
            <li key={keyPoint}>
              <Button
                variant="ghost"
                aria-pressed={isChecked}
                onClick={() => handleTogglePoint(keyPoint)}
                className={cn(
                  "w-full items-start justify-start gap-3 px-3 py-2 text-left font-normal hover:bg-item-hover",
                  isChecked && "text-muted line-through hover:text-muted",
                  !isChecked && "text-foreground hover:text-foreground",
                )}
              >
                {isChecked && <CheckSquare2 className="mt-0.5 size-4 shrink-0 text-emerald-700" aria-hidden />}
                {!isChecked && <Square className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />}
                <MarkdownText content={keyPoint} isInline className="text-inherit" />
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
