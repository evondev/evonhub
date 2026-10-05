import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { editorOptions } from "@/constants";
import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "next-themes";
import { useFormContext } from "react-hook-form";
import { LESSON_EDITOR_HEIGHT } from "../constants";
import type { LessonEditorValues } from "../types";
import { LessonEditorSection } from "./lesson-editor-section";

export function LessonContentSection() {
  const { control, resetField } = useFormContext<LessonEditorValues>();
  const { theme } = useTheme();

  // TinyMCE chuẩn hoá HTML lúc nạp (bỏ xuống dòng, thêm thẻ): lấy bản đã chuẩn hoá
  // làm mốc, không thì mở bài ra chưa sửa gì form đã tính là "chưa lưu"
  function handleEditorInit(normalizedContent: string) {
    resetField("content", { defaultValue: normalizedContent });
  }

  return (
    <LessonEditorSection
      title="Nội dung"
      description="Hiện dưới video ở trang học: link nhóm, source code, ghi chú."
    >
      <FormField
        control={control}
        name="content"
        render={({ field }) => (
          <FormItem className="space-y-1.5">
            <FormControl>
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                onInit={(_event, editor) => {
                  editor.setContent(field.value || "");
                  handleEditorInit(editor.getContent());
                }}
                value={field.value}
                {...editorOptions(field, theme, LESSON_EDITOR_HEIGHT)}
              />
            </FormControl>
            <FormMessage className="text-xs font-normal text-red-600 dark:text-red-400" />
          </FormItem>
        )}
      />
    </LessonEditorSection>
  );
}
