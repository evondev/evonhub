import { Button } from "@/components/ui/button";
import { SEARCH_KEYWORD_MAX_LENGTH } from "@/shared/constants/search.constants";
import { truncateKeyword } from "@/shared/utils";

interface ModerationListEmptyProps {
  search: string;
  hasCourseFilter: boolean;
  /** Đơn vị trong câu, ví dụ "bình luận", "đánh giá" */
  itemLabel: string;
  /** Câu khi không tìm, không lọc khoá; tuỳ tab, ví dụ "Không còn bình luận nào chờ duyệt." */
  defaultMessage: string;
  onClearFilters: () => void;
}

const clearButtonClassName =
  "inline h-auto min-h-0 p-0 align-baseline font-medium text-foreground underline-offset-4 hover:bg-transparent hover:text-foreground hover:underline";

/** Một dòng chữ mờ, nói đúng thứ đang lọc, kèm lối ra khi người dùng tự lọc */
export function ModerationListEmpty({
  search,
  hasCourseFilter,
  itemLabel,
  defaultMessage,
  onClearFilters,
}: ModerationListEmptyProps) {
  const hasKeyword = Boolean(search);

  return (
    <p className="px-4 py-10 text-center text-sm text-pretty text-muted">
      {hasKeyword && (
        <>
          Không có {itemLabel} nào khớp{" "}
          <span title={search} className="text-foreground">
            “{truncateKeyword(search, SEARCH_KEYWORD_MAX_LENGTH)}”
          </span>
          . Thử từ khoá khác.{" "}
        </>
      )}
      {!hasKeyword && hasCourseFilter && (
        <>Khoá này không có {itemLabel} nào ở mục này. </>
      )}
      {!hasKeyword && !hasCourseFilter && defaultMessage}
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
