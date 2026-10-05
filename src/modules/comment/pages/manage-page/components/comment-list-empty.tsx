import { Button } from "@/components/ui/button";
import { SEARCH_KEYWORD_MAX_LENGTH } from "@/shared/constants/search.constants";
import { truncateKeyword } from "@/shared/utils";
import { COMMENT_EMPTY_MESSAGES } from "../../../constants/comment-manage.constants";
import { CommentManageFilters } from "../../../types/comment-manage.types";

interface CommentListEmptyProps {
  filters: CommentManageFilters;
  onClearFilters: () => void;
}

const clearButtonClassName =
  "inline h-auto min-h-0 p-0 align-baseline font-medium text-foreground underline-offset-4 hover:bg-transparent hover:text-foreground hover:underline";

/** Một dòng chữ mờ, nói đúng thứ đang lọc, kèm lối ra khi người dùng tự lọc */
export function CommentListEmpty({
  filters,
  onClearFilters,
}: CommentListEmptyProps) {
  const hasKeyword = Boolean(filters.search);
  const hasCourseFilter = Boolean(filters.courseId);

  return (
    <p className="px-4 py-10 text-center text-sm text-pretty text-muted">
      {hasKeyword && (
        <>
          Không có bình luận nào khớp{" "}
          <span title={filters.search} className="text-foreground">
            “{truncateKeyword(filters.search, SEARCH_KEYWORD_MAX_LENGTH)}”
          </span>
          . Thử từ khoá khác.{" "}
        </>
      )}
      {!hasKeyword && hasCourseFilter && (
        <>Khoá này không có bình luận nào ở mục này. </>
      )}
      {!hasKeyword && !hasCourseFilter && COMMENT_EMPTY_MESSAGES[filters.tab]}
      {(hasKeyword || hasCourseFilter) && (
        <Button
          variant="ghost"
          onClick={onClearFilters}
          className={clearButtonClassName}
        >
          {hasCourseFilter && "Xoá lọc"}
          {!hasCourseFilter && "Xoá tìm kiếm"}
        </Button>
      )}
    </p>
  );
}
