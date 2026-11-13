import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/shared/utils";
import { Check, Plus, X } from "lucide-react";
import { INTERVIEW_OPTION_LIMITS, INTERVIEW_TEXT_LIMITS } from "../../../constants";
import { InterviewOptionValues } from "../../../types";
import { removeItemAt, replaceItemAt } from "../../../utils";

interface EditorOptionsProps {
  options: InterviewOptionValues[];
  onChange: (options: InterviewOptionValues[]) => void;
}

const OPTION_LETTERS = ["A", "B", "C", "D"];

/** Các đáp án, bấm ô chữ cái để chọn đáp án đúng */
export function EditorOptions({ options, onChange }: EditorOptionsProps) {
  function markCorrect(correctIndex: number) {
    onChange(options.map((option, index) => ({ ...option, isCorrect: index === correctIndex })));
  }

  function removeOption(index: number) {
    const remainingOptions = removeItemAt(options, index);
    const hasCorrectOption = remainingOptions.some((option) => option.isCorrect);

    // Xoá đúng đáp án đúng thì chuyển dấu đúng sang đáp án đầu, không để câu không có đáp án đúng
    onChange(
      hasCorrectOption
        ? remainingOptions
        : remainingOptions.map((option, optionIndex) => ({ ...option, isCorrect: optionIndex === 0 })),
    );
  }

  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium text-foreground">
        Đáp án <span className="font-normal text-muted">· bấm chữ cái để chọn đáp án đúng</span>
      </legend>
      <div className="flex flex-col gap-2">
        {options.map((option, index) => (
          // Đáp án chưa có id, thứ tự chỉ đổi khi xoá nên dùng vị trí làm key
          <div key={index} className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              role="radio"
              aria-checked={option.isCorrect}
              aria-label={`Đáp án đúng là ${OPTION_LETTERS[index]}`}
              onClick={() => markCorrect(index)}
              className={cn(
                "shrink-0 text-xs font-semibold",
                option.isCorrect && "border-emerald-600 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-400",
                !option.isCorrect && "text-foreground/70",
              )}
            >
              {option.isCorrect ? <Check className="size-4" /> : OPTION_LETTERS[index]}
            </Button>
            <Input
              value={option.text}
              maxLength={INTERVIEW_TEXT_LIMITS.option}
              aria-label={`Đáp án ${OPTION_LETTERS[index]}`}
              className="font-normal"
              onChange={(event) => onChange(replaceItemAt(options, index, { ...option, text: event.target.value }))}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              aria-label={`Bỏ đáp án ${OPTION_LETTERS[index]}`}
              disabled={options.length <= INTERVIEW_OPTION_LIMITS.min}
              onClick={() => removeOption(index)}
            >
              <X className="size-4" />
            </Button>
          </div>
        ))}
        {options.length < INTERVIEW_OPTION_LIMITS.max && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-fit"
            onClick={() => onChange([...options, { text: "", isCorrect: false }])}
          >
            <Plus className="size-4" />
            Thêm đáp án
          </Button>
        )}
      </div>
    </fieldset>
  );
}
