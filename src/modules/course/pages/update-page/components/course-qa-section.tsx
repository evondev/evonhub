import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { COURSE_FORM_CONTROL_CLASS_NAME } from "../../../constants";
import type { CourseQaItem } from "../../../types";
import { CourseFormSection } from "./course-form-section";

export interface CourseQaSectionProps {
  items: CourseQaItem[];
  onAdd: () => void;
  onChange: (index: number, changes: Partial<CourseQaItem>) => void;
  onRemove: (index: number) => void;
}

export function CourseQaSection({
  items,
  onAdd,
  onChange,
  onRemove,
}: CourseQaSectionProps) {
  const hasItems = items.length > 0;

  return (
    <CourseFormSection
      title="Hỏi đáp"
      description="Hiện ở mục Hỏi đáp cuối trang bán khóa học."
    >
      {hasItems && (
        <ol className="flex flex-col divide-y divide-border">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-foreground">
                  Câu {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Xóa câu ${index + 1}`}
                  className="size-8 shrink-0 rounded-lg hover:bg-rose-500/10 hover:text-rose-700 dark:hover:text-rose-400"
                  onClick={() => onRemove(index)}
                >
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              </div>
              <Input
                aria-label={`Câu hỏi ${index + 1}`}
                placeholder="Câu hỏi"
                value={item.question}
                onChange={(event) =>
                  onChange(index, { question: event.target.value })
                }
                className={COURSE_FORM_CONTROL_CLASS_NAME}
              />
              <Textarea
                aria-label={`Trả lời câu ${index + 1}`}
                placeholder="Câu trả lời"
                rows={3}
                value={item.answer}
                onChange={(event) =>
                  onChange(index, { answer: event.target.value })
                }
                className="min-h-24 resize-y"
              />
            </li>
          ))}
        </ol>
      )}

      {!hasItems && (
        <p className="text-sm text-muted">Chưa có câu hỏi nào.</p>
      )}

      <Button
        type="button"
        variant="outline"
        className="mt-3 h-11 md:h-10"
        onClick={onAdd}
      >
        <Plus className="size-4 shrink-0" aria-hidden />
        Thêm câu hỏi
      </Button>
    </CourseFormSection>
  );
}
