import { cn } from "@/shared/utils";
import { CategoryManageItem } from "../../../types";
import { formatCategoryUsage, isCategoryInUse } from "../../../utils";
import { CategoryRowMenu } from "./category-row-menu";

interface CategoryListItemProps {
  category: CategoryManageItem;
  onEdit: (category: CategoryManageItem) => void;
  onDelete: (category: CategoryManageItem) => void;
}

export function CategoryListItem({
  category,
  onEdit,
  onDelete,
}: CategoryListItemProps) {
  const isInUse = isCategoryInUse(category);

  return (
    // Menu ⋯ đang mở thì dòng tô nhạt để biết menu thuộc dòng nào
    <li className="flex items-center gap-3 border-b border-border py-3 pl-5 pr-3 last:border-0 has-[[data-state=open]]:bg-foreground/[0.025]">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {category.name}
        </p>
        <p className="mt-0.5 truncate text-xs text-muted">
          {category.slug}
          {/* Dưới sm không đủ chỗ cột bên phải: số lượt dùng xuống dòng phụ */}
          <span className="sm:hidden"> · {formatCategoryUsage(category)}</span>
        </p>
      </div>
      <p
        className={cn(
          "hidden shrink-0 whitespace-nowrap text-sm tabular-nums sm:block",
          isInUse && "text-foreground/80",
          !isInUse && "text-muted",
        )}
      >
        {formatCategoryUsage(category)}
      </p>
      <CategoryRowMenu
        category={category}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </li>
  );
}
