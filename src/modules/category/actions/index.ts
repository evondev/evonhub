"use server";

import CourseModel from "@/modules/course/models";
import { CourseType } from "@/shared/constants/course.constants";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import { getCurrentAdmin } from "@/shared/libs/auth";
import { convertSlug } from "@/utils";
import { isValidObjectId } from "mongoose";
import { revalidatePath } from "next/cache";
import {
  CATEGORY_DELETE_ERROR_MESSAGE,
  CATEGORY_MANAGE_PATH,
  CATEGORY_PERMISSION_MESSAGE,
  CATEGORY_SAVE_ERROR_MESSAGE,
  CATEGORY_SLUG_TAKEN_MESSAGE,
} from "../constants";
import CategoryModel from "../models";
import { categoryFormSchema } from "../schemas";
import {
  CategoryActionResponse,
  CategoryManageItem,
  CategoryOption,
  SaveCategoryParams,
} from "../types";

interface CategoryUsageGroup {
  _id: string;
  courseCount: number;
  videoCount: number;
}

/** Danh mục cho ô chọn ở form khóa học, video, xếp theo tên */
export async function fetchCategoryOptions(): Promise<CategoryOption[]> {
  try {
    await connectToDatabase();

    const categories = await CategoryModel.find()
      .sort({ name: 1 })
      .select("name")
      .lean<{ _id: string; name: string }[]>();

    return categories.map((category) => ({
      value: category._id.toString(),
      label: category.name,
    }));
  } catch (error) {
    console.log(error);

    return [];
  }
}

/** Trang quản lý danh mục, chỉ admin đọc được. Lỗi hoặc không có quyền trả undefined */
export async function fetchCategoriesManage(): Promise<
  CategoryManageItem[] | undefined
> {
  try {
    await connectToDatabase();
    const currentAdmin = await getCurrentAdmin();

    if (!currentAdmin) return;

    const [categories, usageGroups] = await Promise.all([
      CategoryModel.find()
        .sort({ name: 1 })
        .select("name slug")
        .lean<{ _id: string; name: string; slug: string }[]>(),
      // Khóa cũ chưa có trường type vẫn tính là khóa học
      CourseModel.aggregate<CategoryUsageGroup>([
        { $match: { category: { $ne: null }, _destroy: false } },
        {
          $group: {
            _id: "$category",
            courseCount: {
              $sum: { $cond: [{ $eq: ["$type", CourseType.Video] }, 0, 1] },
            },
            videoCount: {
              $sum: { $cond: [{ $eq: ["$type", CourseType.Video] }, 1, 0] },
            },
          },
        },
      ]),
    ]);

    const usageByCategoryId = new Map(
      usageGroups.map((group) => [group._id.toString(), group]),
    );

    return parseData(
      categories.map((category) => {
        const usage = usageByCategoryId.get(category._id.toString());

        return {
          _id: category._id,
          name: category.name,
          slug: category.slug,
          courseCount: usage?.courseCount || 0,
          videoCount: usage?.videoCount || 0,
        };
      }),
    );
  } catch (error) {
    console.log(error);
  }
}

/** Tạo khi không có categoryId, sửa khi có. Đường dẫn trống thì tạo từ tên */
export async function saveCategory({
  categoryId,
  name,
  slug,
}: SaveCategoryParams): Promise<CategoryActionResponse> {
  try {
    await connectToDatabase();
    const currentAdmin = await getCurrentAdmin();

    if (!currentAdmin) {
      return { type: "error", message: CATEGORY_PERMISSION_MESSAGE };
    }

    const parsedForm = categoryFormSchema.safeParse({ name, slug });

    if (!parsedForm.success) {
      return { type: "error", message: parsedForm.error.issues[0].message };
    }

    const categoryName = parsedForm.data.name;
    const categorySlug = convertSlug(
      parsedForm.data.slug?.trim() || categoryName,
    );

    if (!categorySlug) {
      return { type: "error", message: "Đường dẫn không hợp lệ" };
    }

    if (categoryId && !isValidObjectId(categoryId)) {
      return { type: "error", message: CATEGORY_SAVE_ERROR_MESSAGE };
    }

    const isSlugTaken = await CategoryModel.exists({
      slug: categorySlug,
      ...(categoryId && { _id: { $ne: categoryId } }),
    });

    if (isSlugTaken) {
      return { type: "error", message: CATEGORY_SLUG_TAKEN_MESSAGE };
    }

    if (categoryId) {
      const updatedCategory = await CategoryModel.findByIdAndUpdate(
        categoryId,
        {
          name: categoryName,
          slug: categorySlug,
        },
      );

      if (!updatedCategory) {
        return { type: "error", message: "Danh mục này không còn nữa" };
      }
    }

    if (!categoryId) {
      await CategoryModel.create({ name: categoryName, slug: categorySlug });
    }

    revalidatePath(CATEGORY_MANAGE_PATH);

    return {
      type: "success",
      message: categoryId ? "Đã lưu danh mục" : "Đã thêm danh mục",
    };
  } catch (error) {
    console.log(error);

    return { type: "error", message: CATEGORY_SAVE_ERROR_MESSAGE };
  }
}

/** Xoá danh mục và gỡ nó khỏi các khóa học, video đang gắn */
export async function deleteCategory(
  categoryId: string,
): Promise<CategoryActionResponse> {
  try {
    await connectToDatabase();
    const currentAdmin = await getCurrentAdmin();

    if (!currentAdmin) {
      return { type: "error", message: CATEGORY_PERMISSION_MESSAGE };
    }

    if (!isValidObjectId(categoryId)) {
      return { type: "error", message: CATEGORY_DELETE_ERROR_MESSAGE };
    }

    await CategoryModel.findByIdAndDelete(categoryId);
    await CourseModel.updateMany(
      { category: categoryId },
      { $unset: { category: 1 } },
    );

    revalidatePath(CATEGORY_MANAGE_PATH);

    return { type: "success", message: "Đã xoá danh mục" };
  } catch (error) {
    console.log(error);

    return { type: "error", message: CATEGORY_DELETE_ERROR_MESSAGE };
  }
}
