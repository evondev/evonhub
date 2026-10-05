import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LESSON_FORM_CONTROL_CLASS_NAME } from "../constants";
import { useFormContext } from "react-hook-form";
import type { LessonEditorValues } from "../types";
import { LessonEditorSection } from "./lesson-editor-section";
import { LessonField } from "./lesson-field";

function validateTitle(title: string) {
  if (!title.trim()) return "Chưa nhập tên bài học";

  return true;
}

export function LessonInfoSection() {
  const { control } = useFormContext<LessonEditorValues>();

  return (
    <LessonEditorSection title="Thông tin bài học">
      <div className="flex flex-col gap-5">
        <FormField
          control={control}
          name="title"
          rules={{ validate: validateTitle }}
          render={({ field }) => (
            <LessonField label="Tên bài học" isRequired>
              <Input className={LESSON_FORM_CONTROL_CLASS_NAME} {...field} />
            </LessonField>
          )}
        />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_160px]">
          <FormField
            control={control}
            name="slug"
            render={({ field }) => (
              <LessonField
                label="Đường dẫn"
                hint="Để trống thì tạo từ tên bài học"
              >
                <Input className={LESSON_FORM_CONTROL_CLASS_NAME} {...field} />
              </LessonField>
            )}
          />
          <FormField
            control={control}
            name="duration"
            render={({ field }) => (
              <LessonField label="Thời lượng (phút)">
                <Input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  className={LESSON_FORM_CONTROL_CLASS_NAME}
                  {...field}
                />
              </LessonField>
            )}
          />
        </div>

        <FormField
          control={control}
          name="trial"
          render={({ field }) => (
            <FormItem className="flex items-start gap-3 space-y-0 border-t border-border pt-5">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                  className="mt-0.5"
                />
              </FormControl>
              <div className="min-w-0">
                <FormLabel className="block w-fit cursor-pointer text-sm font-medium leading-6 text-foreground">
                  Cho học thử
                </FormLabel>
                <p className="text-pretty text-sm text-muted">
                  Người chưa mua khóa học vẫn xem được bài này.
                </p>
              </div>
            </FormItem>
          )}
        />
      </div>
    </LessonEditorSection>
  );
}
