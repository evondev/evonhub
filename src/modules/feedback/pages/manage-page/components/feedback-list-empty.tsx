import { Button } from "@/components/ui/button";
import { SEARCH_KEYWORD_MAX_LENGTH } from "@/shared/constants/search.constants";
import { truncateKeyword } from "@/shared/utils";

interface FeedbackListEmptyProps {
  search: string;
  onClearSearch: () => void;
}

const clearButtonClassName =
  "inline h-auto min-h-0 p-0 align-baseline font-medium text-foreground underline-offset-4 hover:bg-transparent hover:text-foreground hover:underline";

/** Một dòng chữ mờ: chưa có góp ý, hoặc không khớp từ khoá kèm lối xoá tìm */
export function FeedbackListEmpty({
  search,
  onClearSearch,
}: FeedbackListEmptyProps) {
  if (!search) {
    return (
      <p className="px-4 py-6 text-center text-sm text-pretty text-muted">
        Chưa có góp ý nào.
      </p>
    );
  }

  return (
    <p className="px-4 py-6 text-center text-sm text-pretty text-muted">
      Không có góp ý nào khớp{" "}
      <span title={search} className="text-foreground">
        “{truncateKeyword(search, SEARCH_KEYWORD_MAX_LENGTH)}”
      </span>
      .{" "}
      <Button
        variant="ghost"
        onClick={onClearSearch}
        className={clearButtonClassName}
      >
        Xoá tìm kiếm
      </Button>
    </p>
  );
}
