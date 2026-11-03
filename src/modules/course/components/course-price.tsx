import { formatThoundsand } from "@/utils";
import { CourseItemData } from "../types";
import { isCourseFree } from "../utils";

interface CoursePriceProps {
  /** Khóa học hay video lẻ đều được, chỉ cần giá và cờ miễn phí */
  course: Pick<CourseItemData, "price" | "salePrice" | "free">;
}

export function CoursePrice({ course }: CoursePriceProps) {
  if (isCourseFree(course)) {
    return (
      <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
        Miễn phí
      </span>
    );
  }

  const hasOriginalPrice = course.salePrice > course.price;

  return (
    <span className="flex flex-wrap items-baseline gap-x-1.5">
      <span className="whitespace-nowrap text-sm font-semibold tabular-nums text-foreground">
        {formatThoundsand(course.price)} đ
      </span>
      {hasOriginalPrice && (
        <span className="hidden whitespace-nowrap text-xs text-muted line-through sm:inline">
          {formatThoundsand(course.salePrice)} đ
        </span>
      )}
    </span>
  );
}
