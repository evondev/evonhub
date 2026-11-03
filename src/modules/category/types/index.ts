import { Document } from "mongoose";
import { z } from "zod";
import { categoryFormSchema } from "../schemas";

export interface CategoryModelProps extends Document {
  name: string;
  slug: string;
  createdAt: Date;
}

/** Một lựa chọn ở ô "Danh mục" của form khóa học, video */
export interface CategoryOption {
  value: string;
  label: string;
}

/** Một dòng ở trang quản lý danh mục, kèm số khóa học và video đang gắn */
export interface CategoryManageItem {
  _id: string;
  name: string;
  slug: string;
  courseCount: number;
  videoCount: number;
}

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export interface SaveCategoryParams {
  /** Có thì sửa danh mục này, không thì tạo mới */
  categoryId?: string;
  name: string;
  slug: string;
}

export interface CategoryActionResponse {
  type: "success" | "error";
  message: string;
}

/** Hộp thêm / sửa: có category là đang sửa danh mục đó, không có là thêm mới */
export interface CategoryFormDialogState {
  isOpen: boolean;
  category?: CategoryManageItem;
}
