import { Checkbox } from "@/components/ui/checkbox";

interface InterviewSelfCheckProps {
  attemptId: string;
  explanationText: string;
  keyPoints: string[];
  coveredKeyPoints: number[];
  onToggle: (keyPointIndex: number) => void;
}

/** Đặt bài học viên tự viết cạnh các ý chính để họ tự tick. Không tính điểm */
export function InterviewSelfCheck({
  attemptId,
  explanationText,
  keyPoints,
  coveredKeyPoints,
  onToggle,
}: InterviewSelfCheckProps) {
  if (!keyPoints.length) return null;

  const hasExplanation = Boolean(explanationText.trim());

  return (
    <div className="flex flex-col gap-3 border-t border-border pt-4">
      <p className="text-sm font-semibold text-foreground">
        {hasExplanation ? "So với câu trả lời của bạn" : "Ý chính cần nói được"}
      </p>
      {hasExplanation && (
        <blockquote className="whitespace-pre-line rounded-lg border-l-2 border-border-strong bg-surface px-3 py-2 text-sm italic text-foreground/80">
          {explanationText.trim()}
        </blockquote>
      )}
      <div>
        <p className="mb-2 text-pretty text-xs text-muted">
          {hasExplanation ? "Tick ý bạn đã nói được" : "Lần sau thử viết vài câu trước khi nộp"} · phần
          này không tính điểm
        </p>
        <ul className="flex flex-col gap-1">
          {keyPoints.map((keyPoint, index) => {
            const checkboxId = `${attemptId}-key-point-${index}`;

            return (
              <li key={checkboxId}>
                <label
                  htmlFor={checkboxId}
                  className="flex min-h-10 cursor-pointer items-start gap-3 rounded-lg px-2 py-2 hover:bg-item-hover"
                >
                  <Checkbox
                    id={checkboxId}
                    checked={coveredKeyPoints.includes(index)}
                    onCheckedChange={() => onToggle(index)}
                    className="mt-0.5"
                  />
                  <span className="text-pretty text-sm text-foreground/90">{keyPoint}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
