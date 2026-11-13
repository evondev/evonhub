import { Button } from "@/components/ui/button";
import { cn } from "@/shared/utils";
import { InterviewChoiceOption } from "../types";

interface InterviewSegmentedControlProps<TValue extends string> {
  label: string;
  options: InterviewChoiceOption<TValue>[];
  value: TValue;
  onChange: (value: TValue) => void;
}

/** Rãnh chìm, ô đang chọn nổi: cùng kiểu thanh chọn kỳ ở trang Xếp hạng */
export function InterviewSegmentedControl<TValue extends string>({
  label,
  options,
  value,
  onChange,
}: InterviewSegmentedControlProps<TValue>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex shrink-0 gap-1 rounded-xl bg-foreground/5 p-1 shadow-segment-track"
    >
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <Button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "h-9 rounded-lg px-3 md:h-8",
              isActive && "bg-surface text-foreground shadow-segment-thumb",
              !isActive && "font-normal text-foreground/75 hover:text-foreground",
            )}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
