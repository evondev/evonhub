import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { InterviewPracticeLogItem } from "../types";
import { InterviewLogSlot } from "./interview-log-slot";

interface InterviewLogOrderProps {
  /** Các dòng log đã trộn */
  logItems: InterviewPracticeLogItem[];
  /** Vị trí gốc của các dòng theo thứ tự học viên chạm */
  logOrder: number[];
  isSubmitted: boolean;
  correctLogItems?: string[];
  onPick: (itemIndex: number) => void;
  onRemove: (itemIndex: number) => void;
  onClear: () => void;
}

export function InterviewLogOrder({
  logItems,
  logOrder,
  isSubmitted,
  correctLogItems,
  onPick,
  onRemove,
  onClear,
}: InterviewLogOrderProps) {
  const textByIndex = new Map(logItems.map((item) => [item.index, item.text]));
  const remainingItems = logItems.filter((item) => !logOrder.includes(item.index));

  return (
    <div className="flex flex-col gap-4">
      <ol aria-label="Thứ tự bạn chọn" className="flex flex-col gap-2">
        {logItems.map((_, position) => {
          const pickedIndex = logOrder[position];
          const pickedText = pickedIndex === undefined ? undefined : textByIndex.get(pickedIndex);

          return (
            <InterviewLogSlot
              key={position}
              position={position}
              text={pickedText}
              isNextSlot={position === logOrder.length}
              isSubmitted={isSubmitted}
              correctText={correctLogItems?.[position]}
              onRemove={pickedIndex === undefined ? undefined : () => onRemove(pickedIndex)}
            />
          );
        })}
      </ol>
      {!isSubmitted && remainingItems.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-muted">Chạm lần lượt theo thứ tự in ra</p>
            {logOrder.length > 0 && (
              <Button variant="ghost" size="sm" className="h-8 px-2" onClick={onClear}>
                <RotateCcw className="size-4" />
                Chọn lại
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {remainingItems.map((item) => (
              <Button
                key={item.index}
                variant="outline"
                className="h-11 whitespace-nowrap px-3 font-mono [font-variant-ligatures:none] sm:px-4 md:h-10"
                onClick={() => onPick(item.index)}
              >
                {item.text}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
