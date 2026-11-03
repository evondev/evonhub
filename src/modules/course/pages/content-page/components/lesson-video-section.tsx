import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { isValidEmbedVideoInput } from "@/shared/utils/video-embed.utils";
import { useFormContext } from "react-hook-form";
import { EMBED_VIDEO_INVALID_MESSAGE } from "@/shared/constants/lesson.constants";
import { LESSON_FORM_CONTROL_CLASS_NAME } from "../constants";
import type { LessonEditorValues } from "../types";
import { LessonEditorSection } from "./lesson-editor-section";
import { LessonField } from "./lesson-field";

export function LessonVideoSection() {
  const { control } = useFormContext<LessonEditorValues>();

  return (
    <LessonEditorSection
      title="Video"
      description="Video trên Mux thì điền Playback ID và Asset ID. Không dùng Mux thì dán link YouTube hoặc Google Drive."
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
          // Form bài học không dùng resolver nên kiểm ở đây; form video lẻ kiểm trong updateVideoSchema
          rules={{
            validate: (value) =>
              isValidEmbedVideoInput(value) || EMBED_VIDEO_INVALID_MESSAGE,
          }}
          render={({ field }) => (
            <LessonField
              label="Link YouTube / Google Drive"
              hint="Dán link hoặc mã nhúng. Có Playback ID Mux thì phát video Mux"
            >
              <Input
                className={LESSON_FORM_CONTROL_CLASS_NAME}
                placeholder="https://www.youtube.com/watch?v=..."
                {...field}
              />
            </LessonField>
          )}
        />
      </div>
    </LessonEditorSection>
  );
}
