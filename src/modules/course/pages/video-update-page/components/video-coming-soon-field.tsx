import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import type { VideoUpdateFormValues } from "../../../types";

/** Video vẫn hiện ở danh sách nhưng chưa xem được, video trả phí ẩn nút mua */
export function VideoComingSoonField() {
  const { control } = useFormContext<VideoUpdateFormValues>();

  return (
    <FormField
      control={control}
      name="isComingSoon"
      render={({ field }) => (
        // Checkbox, không công tắc: phải bấm Lưu mới có hiệu lực
        <label className="mt-5 flex w-fit cursor-pointer items-start gap-3">
          <Checkbox
            className="mt-0.5"
            checked={Boolean(field.value)}
            onCheckedChange={(checked) => field.onChange(checked === true)}
          />
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">
              Sắp ra mắt
            </span>
            <span className="text-pretty text-sm text-muted">
              Vẫn hiện ở danh sách, chưa ai xem được nội dung. Video trả phí ẩn
              nút mua.
            </span>
          </span>
        </label>
      )}
    />
  );
}
