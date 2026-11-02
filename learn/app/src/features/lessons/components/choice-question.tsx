"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import type { ChoiceQuestion as ChoiceQuestionData } from "../types/lesson";
import ChoiceOption from "./choice-option";
import MarkdownText from "./markdown-text";

interface ChoiceQuestionProps {
  question: ChoiceQuestionData;
  committedAnswerId?: string;
  onCommit: (optionId: string, isCorrect: boolean) => void;
}

export default function ChoiceQuestion({ question, committedAnswerId, onCommit }: ChoiceQuestionProps) {
  const [selectedOptionId, setSelectedOptionId] = useState(committedAnswerId);
  const isRevealed = Boolean(committedAnswerId);

  function handleCommit() {
    const selectedOption = question.options.find((option) => option.id === selectedOptionId);
    if (!selectedOption) return;

    onCommit(selectedOption.id, selectedOption.isCorrect);
  }

  return (
    <div className="space-y-3">
      <MarkdownText content={question.prompt} className="text-base font-medium" />
      <div className="space-y-2">
        {question.options.map((option) => (
          <ChoiceOption
            key={option.id}
            option={option}
            isSelected={selectedOptionId === option.id}
            isRevealed={isRevealed}
            onSelect={setSelectedOptionId}
          />
        ))}
      </div>
      {!isRevealed && (
        <div className="flex items-center gap-3">
          <Button variant="primary" disabled={!selectedOptionId} onClick={handleCommit}>
            Chốt đáp án
          </Button>
          <span className="text-xs text-muted">Chốt rồi mới xem được giải thích.</span>
        </div>
      )}
    </div>
  );
}
