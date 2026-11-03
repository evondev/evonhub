import { CategoryManageItem } from "../../../types";
import { CategoryListItem } from "./category-list-item";

interface CategoryListProps {
  categories: CategoryManageItem[];
  onEdit: (category: CategoryManageItem) => void;
  onDelete: (category: CategoryManageItem) => void;
}

/** Một dòng mỗi danh mục ở mọi bề rộng: chỉ có tên, đường dẫn, số lượt dùng */
export function CategoryList({
  categories,
  onEdit,
  onDelete,
}: CategoryListProps) {
  return (
    <section
      aria-label="Danh sách danh mục"
      className="overflow-hidden rounded-2xl border border-border bg-surface"
    >
      {categories.length === 0 && (
        // Nút "Thêm danh mục" đã ở thanh trên, không lặp ở đây
        <p className="px-4 py-6 text-center text-sm text-pretty text-muted">
          Chưa có danh mục nào. Thêm danh mục để gắn cho khóa học, video và cho
          người xem lọc.
        </p>
      )}
      {categories.length > 0 && (
        <ul>
          {categories.map((category) => (
            <CategoryListItem
              key={category._id}
              category={category}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
