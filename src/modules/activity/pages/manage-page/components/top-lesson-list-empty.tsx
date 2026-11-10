import { Button } from "@/components/ui/button";
import { ActivityManageFilters } from "../../../types";

interface TopLessonListEmptyProps {
  filters: ActivityManageFilters;
  onClearFilters: () => void;
}

const clearButtonClassName =
  "inline h-auto min-h-0 p-0 align-baseline font-medium text-foreground underline-offset-4 hover:bg-transparent hover:text-foreground hover:underline";

/** Chưa có bài nào được học trong phạm vi đang lọc, kèm lối ra khi có lọc */
export function TopLessonListEmpty({
  filters,
  onClearFilters,
}: TopLessonListEmptyProps) {
  const hasFilters = Boolean(
    filters.search || filters.courseId || filters.from || filters.to,
  );

  return (
    <p className="px-4 py-6 text-center text-sm text-pretty text-muted">
      {hasFilters && <>Không có bài nào được học trong phạm vi đang lọc. </>}
      {!hasFilters && <>Chưa có bài nào được học.</>}
      {hasFilters && (
        <Button
          variant="ghost"
          onClick={onClearFilters}
          className={clearButtonClassName}
        >
          Xoá lọc
        </Button>
      )}
    </p>
  );
}
