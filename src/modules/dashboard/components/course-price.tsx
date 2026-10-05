import { CourseItemData } from "@/modules/course/types";
import { isCourseFree } from "@/modules/course/utils";
import { formatThoundsand } from "@/utils";

interface CoursePriceProps {
  course: CourseItemData;
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
    <span className="flex items-baseline gap-1.5">
      <span className="text-sm font-semibold tabular-nums text-foreground">
        {formatThoundsand(course.price)} đ
      </span>
      {hasOriginalPrice && (
        <span className="hidden text-xs text-muted line-through sm:inline">
          {formatThoundsand(course.salePrice)} đ
        </span>
      )}
    </span>
  );
}
