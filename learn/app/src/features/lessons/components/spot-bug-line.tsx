"use client";

import { Button } from "@/components/button";
import { cn } from "@/utils/cn";

interface SpotBugLineProps {
  lineNumber: number;
  lineHtml: string;
  isSelected: boolean;
  isChecked: boolean;
  isBug: boolean;
  onToggle: (lineNumber: number) => void;
}

function getLineClasses(isSelected: boolean, isChecked: boolean, isBug: boolean) {
  const isFound = isChecked && isSelected && isBug;
  const isMissed = isChecked && !isSelected && isBug;
  const isWrongPick = isChecked && isSelected && !isBug;

  return cn(
    "flex min-h-6 w-full items-center justify-start gap-0 rounded-none border-l-2 border-transparent px-0 py-0 text-left font-mono text-[13px] font-normal leading-relaxed text-foreground",
    !isChecked && "hover:bg-primary-light hover:text-foreground",
    !isChecked && isSelected && "border-foreground bg-foreground/[0.07] hover:bg-foreground/[0.07]",
    isChecked && "cursor-default hover:bg-transparent",
    isFound && "border-emerald-600 bg-emerald-50 hover:bg-emerald-50",
    isMissed && "border-amber-500 bg-amber-50 hover:bg-amber-50",
    isWrongPick && "border-red-600 bg-red-50 hover:bg-red-50",
  );
}

export default function SpotBugLine({ lineNumber, lineHtml, isSelected, isChecked, isBug, onToggle }: SpotBugLineProps) {
  return (
    <Button
      variant="ghost"
      aria-pressed={isSelected}
      disabled={isChecked}
      onClick={() => onToggle(lineNumber)}
      className={cn(getLineClasses(isSelected, isChecked, isBug), "disabled:not-aria-busy:opacity-100")}
    >
      <span className="w-10 shrink-0 pr-3 text-right text-muted select-none">{lineNumber}</span>
      <code className="pr-4 whitespace-pre" dangerouslySetInnerHTML={{ __html: lineHtml || " " }} />
    </Button>
  );
}
