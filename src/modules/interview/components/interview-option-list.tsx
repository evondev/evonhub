import { Button } from "@/components/ui/button";
import { InterviewPracticeOption } from "../types";
import {
  getOptionClassName,
  getOptionMarkerClassName,
  getOptionVisualState,
} from "../utils/interview-option-style.utils";
import { InterviewOptionMarker } from "./interview-option-marker";

interface InterviewOptionListProps {
  options: InterviewPracticeOption[];
  selectedOptionId: string;
  correctOptionId?: string;
  isSubmitted: boolean;
  onSelect: (optionId: string) => void;
}

const OPTION_LETTERS = ["A", "B", "C", "D"];

export function InterviewOptionList({
  options,
  selectedOptionId,
  correctOptionId,
  isSubmitted,
  onSelect,
}: InterviewOptionListProps) {
  return (
    <div role="radiogroup" aria-label="Đáp án" className="flex flex-col gap-2">
      {options.map((option, index) => {
        const visualState = getOptionVisualState({
          optionId: option.id,
          selectedOptionId,
          correctOptionId,
          isSubmitted,
        });

        return (
          <Button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={option.id === selectedOptionId}
            disabled={isSubmitted}
            onClick={() => onSelect(option.id)}
            className={getOptionClassName(visualState)}
          >
            <span className={getOptionMarkerClassName(visualState)}>
              <InterviewOptionMarker
                visualState={visualState}
                letter={OPTION_LETTERS[index]}
              />
            </span>
            <span className="min-w-0 flex-1 text-pretty">{option.text}</span>
          </Button>
        );
      })}
    </div>
  );
}
