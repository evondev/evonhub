import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext, useWatch } from "react-hook-form";
import { COURSE_FORM_CONTROL_CLASS_NAME } from "../../../constants";
import type { CourseUpdateFormValues } from "../../../types";
import { getCourseDiscountPercent } from "../../../utils";
import { CourseField } from "./course-field";
import { CourseFormSection } from "./course-form-section";
import { InputWithAddon } from "./input-with-addon";

export function CoursePricingSection() {
  const { control } = useFormContext<CourseUpdateFormValues>();
  const [price, salePrice, isFree] = useWatch({
    control,
    name: ["price", "salePrice", "free"],
  });
  const discountPercent = getCourseDiscountPercent(
    Number(price || 0),
    Number(salePrice || 0),
  );
  const priceHint = discountPercent
    ? `Giảm ${discountPercent}% so với giá gốc`
    : "Số tiền học viên trả";

  return (
    <CourseFormSection title="Giá và nút mua">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          control={control}
          name="free"
          render={({ field }) => (
            // Checkbox, không công tắc: phải bấm Lưu mới có hiệu lực
            <label className="flex w-fit cursor-pointer items-start gap-3 sm:col-span-2">
              <Checkbox
                className="mt-0.5"
                checked={Boolean(field.value)}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">
                  Khóa học miễn phí
                </span>
                <span className="text-pretty text-sm text-muted">
                  Học viên vào học không cần mua, trang bán ghi Miễn phí thay cho giá.
                </span>
              </span>
            </label>
          )}
        />
        <FormField
          control={control}
          name="price"
          render={({ field }) => (
            <CourseField label="Giá bán" hint={isFree ? undefined : priceHint}>
              <InputWithAddon
                type="number"
                inputMode="numeric"
                min={0}
                trailingText="đ"
                disabled={isFree}
                {...field}
              />
            </CourseField>
          )}
        />
        <FormField
          control={control}
          name="salePrice"
          render={({ field }) => (
            <CourseField
              label="Giá gốc"
              hint={isFree ? undefined : "Hiện gạch ngang cạnh giá bán"}
            >
              <InputWithAddon
                type="number"
                inputMode="numeric"
                min={0}
                trailingText="đ"
                disabled={isFree}
                {...field}
              />
            </CourseField>
          )}
        />
        <FormField
          control={control}
          name="cta"
          render={({ field }) => (
            <CourseField label="Chữ trên nút mua" hint="Ví dụ: Mua ngay, Đăng ký học">
              <Input className={COURSE_FORM_CONTROL_CLASS_NAME} {...field} />
            </CourseField>
          )}
        />
      </div>
    </CourseFormSection>
  );
}
