import { Button } from "@/components/ui/button";
import { SEARCH_KEYWORD_MAX_LENGTH } from "@/shared/constants/search.constants";
import { truncateKeyword } from "@/shared/utils";
import { ActivityManageFilters } from "../../../types";
import { isActivityGroupTab } from "../../../utils";

interface ActivityListEmptyProps {
  filters: ActivityManageFilters;
  onClearFilters: () => void;
}

const clearButtonClassName =
  "inline h-auto min-h-0 p-0 align-baseline font-medium text-foreground underline-offset-4 hover:bg-transparent hover:text-foreground hover:underline";

/** Một dòng chữ mờ, nói đúng thứ đang lọc, kèm lối ra khi người dùng tự lọc */
export function ActivityListEmpty({
  filters,
  onClearFilters,
}: ActivityListEmptyProps) {
  const hasKeyword = Boolean(filters.search);
  const hasCourseFilter = Boolean(filters.courseId);
  const hasDateFilter = Boolean(filters.from || filters.to);
  const isOnlineTab = filters.tab === "online";
  const isGroupTab = isActivityGroupTab(filters.tab);

  return (
    <p className="px-4 py-6 text-center text-sm text-pretty text-muted">
      {hasKeyword && (
        <>
          Không có hoạt động nào của{" "}
          <span title={filters.search} className="text-foreground">
            “{truncateKeyword(filters.search, SEARCH_KEYWORD_MAX_LENGTH)}”
          </span>
          {isOnlineTab && " lúc này"}.{" "}
        </>
      )}
      {!hasKeyword && isOnlineTab && <>Lúc này chưa có ai đang học. </>}
      {!hasKeyword && isGroupTab && <>Chưa có hoạt động nào ở mục này. </>}
      {!hasKeyword && !isOnlineTab && !isGroupTab && hasDateFilter && (
        <>Không có hoạt động nào trong thời gian này. </>
      )}
      {!hasKeyword &&
        !isOnlineTab &&
        !isGroupTab &&
        !hasDateFilter &&
        hasCourseFilter && <>Khoá này chưa có hoạt động nào. </>}
      {!hasKeyword &&
        !isOnlineTab &&
        !isGroupTab &&
        !hasDateFilter &&
        !hasCourseFilter && <>Chưa có hoạt động nào.</>}
      {(hasKeyword || hasCourseFilter || hasDateFilter) && (
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
