import { Textarea } from "@/components/ui/textarea";
import { INTERVIEW_TEXT_LIMITS } from "../constants";

interface InterviewWhyInputProps {
  questionId: string;
  value: string;
  onChange: (value: string) => void;
}

/** Ô "Vì sao?": viết trước khi nộp, nộp rồi mới thấy giải thích để không chép lại */
export function InterviewWhyInput({ questionId, value, onChange }: InterviewWhyInputProps) {
  const inputId = `why-${questionId}`;

  return (
    <div>
      <label htmlFor={inputId} className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <span className="text-sm font-medium text-foreground">Vì sao?</span>
        <span className="text-xs text-muted">
          Không bắt buộc · trả lời như đang nói với người phỏng vấn
        </span>
      </label>
      <Textarea
        id={inputId}
        rows={3}
        value={value}
        maxLength={INTERVIEW_TEXT_LIMITS.studentExplanation}
        placeholder="Ví dụ: vì trong lần render này giá trị đang là…"
        className="resize-y font-normal !leading-6"
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
