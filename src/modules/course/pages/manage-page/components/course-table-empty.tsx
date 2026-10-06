import { Button } from "@/components/ui/button";
import { SEARCH_KEYWORD_MAX_LENGTH } from "@/shared/constants/search.constants";
import { truncateKeyword } from "@/shared/utils";
import { CourseManageFilters } from "../../../types/course-manage.types";

interface CourseTableEmptyProps {
  filters: CourseManageFilters;
  onClearFilters: () => void;
}

const clearButtonClassName =
  "inline h-auto min-h-0 p-0 align-baseline font-medium text-foreground underline-offset-4 hover:bg-transparent hover:text-foreground hover:underline";

/** Một dòng chữ mờ, nói đúng thứ đang lọc, kèm lối ra khi người dùng tự lọc */
export function CourseTableEmpty({
  filters,
  onClearFilters,
}: CourseTableEmptyProps) {
  const hasKeyword = Boolean(filters.search);
  const hasOtherFilters = filters.tab !== "all" || filters.isFree;

  return (
    <p className="px-4 py-6 text-center text-sm text-pretty text-muted">
      {hasKeyword && (
        <>
          Không có khóa học nào khớp{" "}
          <span title={filters.search} className="text-foreground">
            “{truncateKeyword(filters.search, SEARCH_KEYWORD_MAX_LENGTH)}”
          </span>
          . Thử từ khoá khác.{" "}
        </>
      )}
      {!hasKeyword && hasOtherFilters && <>Không có khóa học nào ở mục này. </>}
      {/* Nút "Thêm khóa học" đã ở thanh trên, không lặp ở đây */}
      {!hasKeyword && !hasOtherFilters && <>Chưa có khóa học nào.</>}
      {(hasKeyword || hasOtherFilters) && (
        <Button
          variant="ghost"
          onClick={onClearFilters}
          className={clearButtonClassName}
        >
          {hasOtherFilters && "Xoá lọc"}
          {!hasOtherFilters && "Xoá tìm kiếm"}
        </Button>
      )}
    </p>
  );
}
