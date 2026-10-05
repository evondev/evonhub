import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { COURSE_FORM_CONTROL_CLASS_NAME } from "../../../constants";
import { CourseFormSection } from "./course-form-section";

export interface CourseInfoListSectionProps {
  title: string;
  description: string;
  /** Tên một dòng, dùng cho aria-label: "Yêu cầu 2", "Xóa yêu cầu 2" */
  itemLabel: string;
  placeholder: string;
  addLabel: string;
  emptyText: string;
  items: string[];
  onAdd: () => void;
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}

export function CourseInfoListSection({
  title,
  description,
  itemLabel,
  placeholder,
  addLabel,
  emptyText,
  items,
  onAdd,
  onChange,
  onRemove,
}: CourseInfoListSectionProps) {
  const hasItems = items.length > 0;

  return (
    <CourseFormSection title={title} description={description}>
      {hasItems && (
        <ol className="flex flex-col gap-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <Input
                aria-label={`${itemLabel} ${index + 1}`}
                placeholder={placeholder}
                value={item}
                onChange={(event) => onChange(index, event.target.value)}
                className={COURSE_FORM_CONTROL_CLASS_NAME}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Xóa ${itemLabel.toLowerCase()} ${index + 1}`}
                className="size-11 shrink-0 hover:bg-rose-500/10 hover:text-rose-700 md:size-10 dark:hover:text-rose-400"
                onClick={() => onRemove(index)}
              >
                <Trash2 className="size-4" aria-hidden />
              </Button>
            </li>
          ))}
        </ol>
      )}

      {!hasItems && <p className="text-sm text-muted">{emptyText}</p>}

      <Button
        type="button"
        variant="outline"
        className="mt-3 h-11 md:h-10"
        onClick={onAdd}
      >
        <Plus className="size-4 shrink-0" aria-hidden />
        {addLabel}
      </Button>
    </CourseFormSection>
  );
}
