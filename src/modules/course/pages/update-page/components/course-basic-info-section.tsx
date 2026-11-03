import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import {
  COURSE_FORM_CONTROL_CLASS_NAME,
  COURSE_LEVEL_OPTIONS,
} from "../../../constants";
import type {
  CourseSelectOption,
  CourseUpdateFormValues,
} from "../../../types";
import { CourseCategorySelect } from "./course-category-select";
import { CourseField } from "./course-field";
import { CourseFormSection } from "./course-form-section";
import { InputWithAddon } from "./input-with-addon";

export interface CourseBasicInfoSectionProps {
  /** Danh mục quản lý ở /admin/category/manage, rỗng thì ô khoá */
  categoryOptions: CourseSelectOption[];
}

export function CourseBasicInfoSection({
  categoryOptions,
}: CourseBasicInfoSectionProps) {
  const { control } = useFormContext<CourseUpdateFormValues>();

  return (
    <CourseFormSection
      title="Thông tin cơ bản"
      description={
        <>
          Mục có dấu{" "}
          <span className="text-red-600 dark:text-red-400">*</span> là bắt
          buộc.
        </>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <CourseField
              label="Tiêu đề"
              hint="Tối thiểu 10 ký tự"
              isRequired
              className="sm:col-span-2"
            >
              <Input className={COURSE_FORM_CONTROL_CLASS_NAME} {...field} />
            </CourseField>
          )}
        />
        <FormField
          control={control}
          name="slug"
          render={({ field }) => (
            <CourseField
              label="Đường dẫn"
              hint="Đổi đường dẫn thì link cũ của khóa học sẽ không vào được nữa"
              className="sm:col-span-2"
            >
              <InputWithAddon leadingText="/course/" {...field} />
            </CourseField>
          )}
        />
        <FormField
          control={control}
          name="level"
          render={({ field }) => (
            <CourseField label="Trình độ">
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className={COURSE_FORM_CONTROL_CLASS_NAME}>
                  <SelectValue placeholder="Chọn trình độ" />
                </SelectTrigger>
                <SelectContent>
                  {COURSE_LEVEL_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CourseField>
          )}
        />
        <FormField
          control={control}
          name="category"
          render={({ field }) => (
            <CourseField label="Danh mục">
              <CourseCategorySelect
                value={field.value}
                onChange={field.onChange}
                options={categoryOptions}
              />
            </CourseField>
          )}
        />
        <FormField
          control={control}
          name="seoKeywords"
          render={({ field }) => (
            <CourseField
              label="Từ khóa SEO"
              hint="Cách nhau bằng dấu phẩy"
              className="sm:col-span-2"
            >
              <Input className={COURSE_FORM_CONTROL_CLASS_NAME} {...field} />
            </CourseField>
          )}
        />
      </div>
    </CourseFormSection>
  );
}
