import { editorOptions } from "@/constants";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "next-themes";
import { useFormContext } from "react-hook-form";
import type { CourseUpdateFormValues } from "../../../types";
import { CourseFormSection } from "./course-form-section";

export function CourseDescriptionSection() {
  const { control } = useFormContext<CourseUpdateFormValues>();
  const { theme } = useTheme();

  return (
    <CourseFormSection
      title="Mô tả"
      description="Hiện ở phần giới thiệu trên trang bán khóa học."
    >
      <FormField
        control={control}
        name="desc"
        render={({ field }) => (
          <FormItem className="space-y-1.5">
            <FormControl>
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                onInit={(_event, editor) => editor.setContent(field.value || "")}
                value={field.value}
                {...editorOptions(field, theme, 360)}
              />
            </FormControl>
            <FormMessage className="text-xs font-normal text-red-600 dark:text-red-400" />
          </FormItem>
        )}
      />
    </CourseFormSection>
  );
}
