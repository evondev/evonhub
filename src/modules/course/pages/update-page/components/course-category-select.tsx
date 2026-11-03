"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveCategory } from "@/modules/category/actions";
import { CategoryFormDialog } from "@/modules/category/components";
import { CategoryFormValues } from "@/modules/category/types";
import { UserRole } from "@/shared/constants/user.constants";
import { useGlobalStore } from "@/store";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  COURSE_FORM_CONTROL_CLASS_NAME,
  CREATE_CATEGORY_VALUE,
  NO_CATEGORY_VALUE,
} from "../../../constants";
import type { CourseSelectOption } from "../../../types";

export interface CourseCategorySelectProps {
  /** id danh mục, rỗng là chưa gắn */
  value?: string;
  onChange: (categoryId: string) => void;
  options: CourseSelectOption[];
}

/**
 * Ô danh mục của form khóa học và video lẻ, có lựa chọn bỏ danh mục.
 * Admin có thêm "Tạo danh mục mới": tạo xong chọn luôn danh mục đó.
 */
export function CourseCategorySelect({
  value,
  onChange,
  options,
}: CourseCategorySelectProps) {
  const { userRole } = useGlobalStore();
  const [createdOptions, setCreatedOptions] = useState<CourseSelectOption[]>(
    [],
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // Chọn "Tạo danh mục mới" thì danh sách đóng đúng lúc hộp tạo mở: chặn
  // danh sách trả focus về ô chọn, không thì giành focus với ô tên trong hộp
  const isOpeningCreateDialogRef = useRef(false);

  const canCreateCategory = userRole === UserRole.Admin;
  // Danh mục vừa tạo chưa có trong options từ server cho tới khi tải lại trang
  const categoryOptions = [...options, ...createdOptions].sort(
    (firstOption, secondOption) =>
      firstOption.label.localeCompare(secondOption.label, "vi"),
  );
  const hasCategories = categoryOptions.length > 0;

  // Radix Select không nhận value rỗng cho một lựa chọn: "bỏ danh mục" đi qua giá trị riêng
  function handleValueChange(nextValue: string) {
    if (nextValue === CREATE_CATEGORY_VALUE) {
      isOpeningCreateDialogRef.current = true;
      setIsCreateDialogOpen(true);
      return;
    }

    onChange(nextValue === NO_CATEGORY_VALUE ? "" : nextValue);
  }

  function handleSelectCloseAutoFocus(event: Event) {
    if (!isOpeningCreateDialogRef.current) return;

    isOpeningCreateDialogRef.current = false;
    event.preventDefault();
  }

  function handleDialogCloseAutoFocus(event: Event) {
    event.preventDefault();
    triggerRef.current?.focus();
  }

  async function handleCreateCategory(values: CategoryFormValues) {
    setIsCreating(true);

    try {
      const response = await saveCategory({
        name: values.name,
        slug: values.slug || "",
      });
      const createdCategory = response.category;

      if (response.type === "error" || !createdCategory) {
        toast.error(response.message);
        return;
      }

      setCreatedOptions((current) => [...current, createdCategory]);
      onChange(createdCategory.value);
      toast.success(response.message);
      setIsCreateDialogOpen(false);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <>
      <Select
        value={value || NO_CATEGORY_VALUE}
        onValueChange={handleValueChange}
        disabled={!hasCategories && !canCreateCategory}
      >
        <SelectTrigger
          ref={triggerRef}
          className={COURSE_FORM_CONTROL_CLASS_NAME}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent onCloseAutoFocus={handleSelectCloseAutoFocus}>
          <SelectItem value={NO_CATEGORY_VALUE}>
            {hasCategories || canCreateCategory
              ? "Không có danh mục"
              : "Chưa có danh mục nào"}
          </SelectItem>
          {categoryOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
          {canCreateCategory && (
            <>
              <SelectSeparator />
              <SelectItem
                value={CREATE_CATEGORY_VALUE}
                className="font-medium text-primary"
              >
                <span className="flex items-center gap-2">
                  <Plus className="size-4" />
                  Tạo danh mục mới
                </span>
              </SelectItem>
            </>
          )}
        </SelectContent>
      </Select>
      {canCreateCategory && (
        <CategoryFormDialog
          isOpen={isCreateDialogOpen}
          isSubmitting={isCreating}
          onSubmit={handleCreateCategory}
          onCancel={() => setIsCreateDialogOpen(false)}
          onCloseAutoFocus={handleDialogCloseAutoFocus}
        />
      )}
    </>
  );
}
