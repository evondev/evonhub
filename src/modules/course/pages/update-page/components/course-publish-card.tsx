import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useFormContext } from "react-hook-form";
import {
  COURSE_FORM_CONTROL_CLASS_NAME,
  COURSE_STATUS_OPTIONS,
} from "../../../constants";
import type { CourseUpdateFormValues } from "../../../types";
import { CourseField } from "./course-field";
import { CourseFormSection } from "./course-form-section";

export interface CoursePublishCardProps {
  /** Đường dẫn đã lưu: xem trước theo bản đang chạy, không theo ô đang sửa */
  savedSlug: string;
  isSubmitting: boolean;
}

export function CoursePublishCard({
  savedSlug,
  isSubmitting,
}: CoursePublishCardProps) {
  const { control } = useFormContext<CourseUpdateFormValues>();

  return (
    <CourseFormSection title="Xuất bản">
      <FormField
        control={control}
        name="status"
        render={({ field }) => (
          <CourseField label="Trạng thái">
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className={COURSE_FORM_CONTROL_CLASS_NAME}>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {COURSE_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CourseField>
        )}
      />

      <div className="mt-5 flex flex-col gap-2 border-t border-border pt-5">
        <Button
          type="submit"
          variant="primary"
          className="h-11 w-full md:h-10"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Lưu thay đổi
        </Button>
        <Button asChild variant="outline" className="h-11 w-full md:h-10">
          <Link href={`/course/${savedSlug}`} target="_blank">
            <ExternalLink className="size-4 shrink-0" aria-hidden />
            Xem trang bán
          </Link>
        </Button>
      </div>
    </CourseFormSection>
  );
}
