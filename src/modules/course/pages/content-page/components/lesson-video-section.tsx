import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { LESSON_FORM_CONTROL_CLASS_NAME } from "../constants";
import type { LessonEditorValues } from "../types";
import { LessonEditorSection } from "./lesson-editor-section";
import { LessonField } from "./lesson-field";

export function LessonVideoSection() {
  const { control } = useFormContext<LessonEditorValues>();

  return (
    <LessonEditorSection
      title="Video"
      description="Video trên Mux thì điền Playback ID và Asset ID. Video từ nguồn khác thì dán mã iframe."
    >
      {/* Mỗi ô một hàng: Playback ID dài 44 ký tự, nửa cột thì bị cắt */}
      <div className="flex flex-col gap-5">
        <FormField
          control={control}
          name="video"
          render={({ field }) => (
            <LessonField label="Playback ID">
              <Input className={LESSON_FORM_CONTROL_CLASS_NAME} {...field} />
            </LessonField>
          )}
        />
        <FormField
          control={control}
          name="assetId"
          render={({ field }) => (
            <LessonField label="Asset ID">
              <Input className={LESSON_FORM_CONTROL_CLASS_NAME} {...field} />
            </LessonField>
          )}
        />
        <FormField
          control={control}
          name="iframe"
          render={({ field }) => (
            <LessonField
              label="Iframe"
              hint="Dùng khi bài không có video trên Mux"
            >
              <Input className={LESSON_FORM_CONTROL_CLASS_NAME} {...field} />
            </LessonField>
          )}
        />
      </div>
    </LessonEditorSection>
  );
}
