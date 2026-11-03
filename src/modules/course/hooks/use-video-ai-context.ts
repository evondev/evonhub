import { COURSE_LEVEL_LABELS } from "@/shared/constants/course.constants";
import type { AiVideoContext } from "@/shared/types/ai.types";
import { useFormContext, useWatch } from "react-hook-form";
import type { CourseSelectOption, VideoUpdateFormValues } from "../types";

/** Tiêu đề, tên danh mục, nhãn trình độ đang nhập ở form sửa video để gửi cho AI */
export function useVideoAiContext(
  categoryOptions: CourseSelectOption[],
): AiVideoContext {
  const { control } = useFormContext<VideoUpdateFormValues>();
  const [title, category, level, description] = useWatch({
    control,
    name: ["title", "category", "level", "desc"],
  });
  const categoryLabel = categoryOptions.find(
    (option) => option.value === category,
  )?.label;

  return {
    title: title || "",
    category: categoryLabel,
    level: level ? COURSE_LEVEL_LABELS[level] : undefined,
    description,
  };
}
