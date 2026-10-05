import { Button } from "@/components/ui/button";
import { UserManageFilters } from "../../../types/user-manage.types";
import { truncateKeyword } from "../../../utils/user-manage.utils";

interface UserTableEmptyProps {
  filters: UserManageFilters;
  onClearFilters: () => void;
}

const clearButtonClassName =
  "inline h-auto min-h-0 p-0 align-baseline font-medium text-foreground underline-offset-4 hover:bg-transparent hover:text-foreground hover:underline";

/** Một dòng chữ mờ, nói đúng thứ đang lọc, kèm lối ra khi người dùng tự lọc */
export function UserTableEmpty({
  filters,
  onClearFilters,
}: UserTableEmptyProps) {
  const hasKeyword = Boolean(filters.search);
  const hasOtherFilters = filters.tab !== "all" || filters.role !== "all";

  return (
    <p className="px-4 py-6 text-center text-sm text-pretty text-muted">
      {hasKeyword && (
        <>
          Không có thành viên nào khớp{" "}
          <span title={filters.search} className="text-foreground">
            “{truncateKeyword(filters.search)}”
          </span>
          . Thử từ khoá khác.{" "}
        </>
      )}
      {!hasKeyword && hasOtherFilters && (
        <>Không có thành viên nào ở mục này. </>
      )}
      {!hasKeyword && !hasOtherFilters && <>Chưa có thành viên nào.</>}
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
