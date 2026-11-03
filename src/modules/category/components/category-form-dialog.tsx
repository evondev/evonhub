"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { CategoryFormValues, CategoryManageItem } from "../types";
import { CategoryForm } from "./category-form";

interface CategoryFormDialogProps {
  isOpen: boolean;
  /** Có thì đang sửa danh mục này, không có là thêm mới */
  category?: CategoryManageItem;
  isSubmitting: boolean;
  onSubmit: (values: CategoryFormValues) => void;
  onCancel: () => void;
  /** Đóng xong thì focus về đâu, mặc định Radix trả về phần tử mở hộp */
  onCloseAutoFocus?: (event: Event) => void;
}

// Cùng khung với ConfirmDialog để các hộp thoại trong khu quản lý trông như nhau
// Căn giữa bằng inset-0 m-auto chứ không translate -50%: keyframe của
// tailwindcss-animate ghi đè transform nên hộp sẽ trượt chéo khi mở
export function CategoryFormDialog({
  isOpen,
  category,
  isSubmitting,
  onSubmit,
  onCancel,
  onCloseAutoFocus,
}: CategoryFormDialogProps) {
  function handleOpenChange(isNextOpen: boolean) {
    if (!isNextOpen && !isSubmitting) onCancel();
  }

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:duration-100 data-[state=open]:duration-150" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          onCloseAutoFocus={onCloseAutoFocus}
          className="fixed inset-0 z-50 m-auto h-fit w-[calc(100%-2rem)] max-w-md rounded-2xl border border-border bg-surface p-6 shadow-lg outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:duration-100 data-[state=open]:duration-200 data-[state=closed]:ease-in data-[state=open]:ease-out motion-reduce:data-[state=closed]:slide-out-to-bottom-0 motion-reduce:data-[state=open]:slide-in-from-bottom-0"
        >
          <DialogPrimitive.Title className="mb-5 text-lg font-semibold text-foreground">
            {category ? "Sửa danh mục" : "Thêm danh mục"}
          </DialogPrimitive.Title>
          <CategoryForm
            category={category}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
