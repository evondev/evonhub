"use client";

import { CheckCircle2, Circle, CircleDot, XCircle } from "lucide-react";
import { Button } from "@/components/button";
import { cn } from "@/utils/cn";
import type { ChoiceOption as ChoiceOptionData } from "../types/lesson";
import MarkdownText from "./markdown-text";

interface ChoiceOptionProps {
  option: ChoiceOptionData;
  isSelected: boolean;
  isRevealed: boolean;
  onSelect: (optionId: string) => void;
}

function getOptionClasses(option: ChoiceOptionData, isSelected: boolean, isRevealed: boolean) {
  const isRightAnswer = isRevealed && option.isCorrect;
  const isWrongPick = isRevealed && isSelected && !option.isCorrect;

  return cn(
    "rounded-xl border transition-colors",
    !isRevealed && !isSelected && "border-border-strong bg-surface has-[button:hover]:bg-button-hover",
    !isRevealed && isSelected && "border-foreground bg-foreground/[0.04]",
    isRightAnswer && "border-emerald-600/40 bg-emerald-50",
    isWrongPick && "border-red-600/30 bg-red-50",
    isRevealed && !isRightAnswer && !isWrongPick && "border-border-strong bg-surface",
  );
}

function getOptionIcon(option: ChoiceOptionData, isSelected: boolean, isRevealed: boolean) {
  if (isRevealed && option.isCorrect) return { Icon: CheckCircle2, className: "text-emerald-700" };
  if (isRevealed && isSelected) return { Icon: XCircle, className: "text-red-700" };
  if (isSelected) return { Icon: CircleDot, className: "text-foreground" };

  return { Icon: Circle, className: "text-muted" };
}

export default function ChoiceOption({ option, isSelected, isRevealed, onSelect }: ChoiceOptionProps) {
  const { Icon, className: iconClassName } = getOptionIcon(option, isSelected, isRevealed);

  return (
    <div className={getOptionClasses(option, isSelected, isRevealed)}>
      <Button
        variant="ghost"
        aria-pressed={isSelected}
        disabled={isRevealed}
        onClick={() => onSelect(option.id)}
        className="w-full items-start justify-start gap-3 px-4 py-3 text-left font-normal text-foreground hover:bg-transparent hover:text-foreground disabled:cursor-default disabled:not-aria-busy:opacity-100"
      >
        <Icon className={cn("mt-0.5 size-4 shrink-0", iconClassName)} aria-hidden />
        <MarkdownText content={option.label} isInline />
      </Button>
      {isRevealed && <MarkdownText content={option.explanation} className="px-4 pb-3 pl-11 text-muted" />}
    </div>
  );
}
