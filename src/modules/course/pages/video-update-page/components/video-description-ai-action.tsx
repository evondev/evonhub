import { AiDescriptionDialog } from "@/shared/components/ai-suggest";
import { useFormContext, useWatch } from "react-hook-form";
import { useVideoAiContext } from "../../../hooks/use-video-ai-context";
import type {
  CourseSelectOption,
  VideoUpdateFormValues,
} from "../../../types";

export interface VideoDescriptionAiActionProps {
  categoryOptions: CourseSelectOption[];
}

/** Nút "Viết bằng AI" ở section Mô tả: đọc tiêu đề trong form, ghi kết quả vào desc */
export function VideoDescriptionAiAction({
  categoryOptions,
}: VideoDescriptionAiActionProps) {
  const { control, setValue } = useFormContext<VideoUpdateFormValues>();
  const aiContext = useVideoAiContext(categoryOptions);
  const currentDescription = useWatch({ control, name: "desc" });

  function handleApply(descriptionHtml: string) {
    setValue("desc", descriptionHtml, { shouldDirty: true });
  }

  return (
    <AiDescriptionDialog
      context={aiContext}
      currentDescription={currentDescription || ""}
      onApply={handleApply}
    />
  );
}
