import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  COURSE_FORM_CONTROL_CLASS_NAME,
  NO_CATEGORY_VALUE,
} from "../../../constants";
import type { CourseSelectOption } from "../../../types";

export interface CourseCategorySelectProps {
  /** id danh mục, rỗng là chưa gắn */
  value?: string;
  onChange: (categoryId: string) => void;
  options: CourseSelectOption[];
}

/** Ô danh mục của form khóa học và video lẻ, có lựa chọn bỏ danh mục */
export function CourseCategorySelect({
  value,
  onChange,
  options,
}: CourseCategorySelectProps) {
  const hasCategories = options.length > 0;

  // Radix Select không nhận value rỗng cho một lựa chọn: "bỏ danh mục" đi qua giá trị riêng
  function handleValueChange(nextValue: string) {
    onChange(nextValue === NO_CATEGORY_VALUE ? "" : nextValue);
  }

  return (
    <Select
      value={value || NO_CATEGORY_VALUE}
      onValueChange={handleValueChange}
      disabled={!hasCategories}
    >
      <SelectTrigger className={COURSE_FORM_CONTROL_CLASS_NAME}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={NO_CATEGORY_VALUE}>
          {hasCategories ? "Không có danh mục" : "Chưa có danh mục nào"}
        </SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
