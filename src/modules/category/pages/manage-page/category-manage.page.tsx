"use client";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/shared/components/common";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { deleteCategory, saveCategory } from "../../actions";
import {
  CategoryFormDialogState,
  CategoryFormValues,
  CategoryManageItem,
} from "../../types";
import { formatCategoryUsage, isCategoryInUse } from "../../utils";
import { CategoryFormDialog } from "../../components";
import { CategoryList } from "./components/category-list";

export interface CategoryManagePageProps {
  categories: CategoryManageItem[];
}

/** Lưu, xoá xong action gọi revalidatePath nên danh sách tự tải lại */
export function CategoryManagePage({ categories }: CategoryManagePageProps) {
  const [formDialog, setFormDialog] = useState<CategoryFormDialogState>({
    isOpen: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [deletingCategory, setDeletingCategory] =
    useState<CategoryManageItem>();
  const [isDeleting, setIsDeleting] = useState(false);

  function handleOpenCreate() {
    setFormDialog({ isOpen: true });
  }

  function handleOpenEdit(category: CategoryManageItem) {
    setFormDialog({ isOpen: true, category });
  }

  function handleCloseForm() {
    setFormDialog((current) => ({ ...current, isOpen: false }));
  }

  async function handleSave(values: CategoryFormValues) {
    setIsSaving(true);

    try {
      const response = await saveCategory({
        categoryId: formDialog.category?._id,
        name: values.name,
        slug: values.slug || "",
      });

      if (response.type === "error") {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      handleCloseForm();
    } finally {
      setIsSaving(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deletingCategory) return;

    setIsDeleting(true);

    try {
      const response = await deleteCategory(deletingCategory._id);

      if (response.type === "error") {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      setDeletingCategory(undefined);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Tab "Danh mục" của thanh quản lý đã là tên trang cho mắt; h1 cho trình đọc màn hình */}
      <h1 className="sr-only">Quản lý danh mục</h1>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted" aria-live="polite">
          <span className="font-semibold tabular-nums text-foreground">
            {categories.length}
          </span>{" "}
          danh mục · dùng chung cho khóa học và video
        </p>
        <Button
          variant="primary"
          className="h-11 shrink-0 px-3.5 sm:px-4 md:h-10"
          onClick={handleOpenCreate}
        >
          <Plus className="size-4" />
          <span className="sm:hidden">Thêm</span>
          <span className="hidden sm:inline">Thêm danh mục</span>
        </Button>
      </div>
      <CategoryList
        categories={categories}
        onEdit={handleOpenEdit}
        onDelete={setDeletingCategory}
      />
      <CategoryFormDialog
        isOpen={formDialog.isOpen}
        category={formDialog.category}
        isSubmitting={isSaving}
        onSubmit={handleSave}
        onCancel={handleCloseForm}
      />
      <ConfirmDialog
        isOpen={Boolean(deletingCategory)}
        icon={Trash2}
        title={`Xoá danh mục “${deletingCategory?.name || ""}”?`}
        description={
          deletingCategory && isCategoryInUse(deletingCategory)
            ? `${formatCategoryUsage(deletingCategory)} đang gắn danh mục này sẽ thành không có danh mục. Không hoàn tác được.`
            : "Danh mục chưa gắn với khóa học hay video nào."
        }
        confirmLabel="Xoá danh mục"
        isConfirming={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingCategory(undefined)}
      />
    </div>
  );
}
