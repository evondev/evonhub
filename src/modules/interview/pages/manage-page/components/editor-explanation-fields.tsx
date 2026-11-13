import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { INTERVIEW_KEY_POINT_LIMITS, INTERVIEW_TEXT_LIMITS } from "../../../constants";
import { InterviewFieldLabel } from "../../../components/interview-field-label";
import { InterviewQuestionFormValues } from "../../../types";
import { removeItemAt, replaceItemAt } from "../../../utils";

interface EditorExplanationFieldsProps {
  explanation: string;
  keyPoints: string[];
  onChange: (changes: Partial<InterviewQuestionFormValues>) => void;
}

/** Giải thích hiện sau khi nộp, và 2–3 ý chính học viên tự đối chiếu */
export function EditorExplanationFields({
  explanation,
  keyPoints,
  onChange,
}: EditorExplanationFieldsProps) {
  return (
    <>
      <div>
        <InterviewFieldLabel htmlFor="interview-explanation" isRequired>
          Giải thích
        </InterviewFieldLabel>
        <Textarea
          id="interview-explanation"
          rows={4}
          value={explanation}
          maxLength={INTERVIEW_TEXT_LIMITS.explanation}
          className="resize-y font-normal !leading-6"
          onChange={(event) => onChange({ explanation: event.target.value })}
        />
      </div>
      <fieldset>
        <legend className="mb-1.5 text-sm font-medium text-foreground">
          Ý chính <span className="font-normal text-muted">· học viên tự đối chiếu, 2–3 ý</span>
        </legend>
        <div className="flex flex-col gap-2">
          {keyPoints.map((keyPoint, index) => (
            // Ý chính chưa có id, chỉ thêm cuối hoặc xoá nên key theo vị trí
            <div key={index} className="flex items-center gap-2">
              <span className="w-5 shrink-0 text-right text-xs tabular-nums text-muted">{index + 1}</span>
              <Input
                value={keyPoint}
                maxLength={INTERVIEW_TEXT_LIMITS.keyPoint}
                aria-label={`Ý chính ${index + 1}`}
                className="font-normal"
                onChange={(event) => onChange({ keyPoints: replaceItemAt(keyPoints, index, event.target.value) })}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
                aria-label={`Bỏ ý ${index + 1}`}
                disabled={keyPoints.length <= INTERVIEW_KEY_POINT_LIMITS.min}
                onClick={() => onChange({ keyPoints: removeItemAt(keyPoints, index) })}
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
          {keyPoints.length < INTERVIEW_KEY_POINT_LIMITS.max && (
            <Button type="button" variant="ghost" size="sm" className="w-fit" onClick={() => onChange({ keyPoints: [...keyPoints, ""] })}>
              <Plus className="size-4" />
              Thêm ý
            </Button>
          )}
        </div>
      </fieldset>
    </>
  );
}
