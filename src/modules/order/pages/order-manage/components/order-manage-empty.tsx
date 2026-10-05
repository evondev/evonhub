import { Button } from "@/components/ui/button";
import { ORDER_MANAGE_EMPTY_MESSAGES } from "../../../constants/order-manage.constants";
import { OrderManageFilters } from "../../../types/order-manage.types";
import { OrderSearchKeyword } from "./order-search-keyword";

interface OrderManageEmptyProps {
  filters: OrderManageFilters;
  onClearFilters: () => void;
}

const clearButtonClassName =
  "inline h-auto min-h-0 p-0 align-baseline font-medium text-foreground underline-offset-4 hover:bg-transparent hover:text-foreground hover:underline";

/** Một dòng chữ mờ, nói đúng thứ đang lọc, kèm lối ra khi người dùng tự lọc */
export function OrderManageEmpty({
  filters,
  onClearFilters,
}: OrderManageEmptyProps) {
  const hasKeyword = Boolean(filters.search);
  const hasNarrowingFilters = hasKeyword || filters.isFree;

  return (
    <p className="px-4 py-10 text-center text-sm text-pretty text-muted">
      {hasKeyword && (
        <>
          Không có đơn nào khớp <OrderSearchKeyword keyword={filters.search} />.
          Thử từ khoá khác.{" "}
        </>
      )}
      {!hasKeyword && filters.isFree && (
        <>Không có đơn miễn phí nào ở mục này. </>
      )}
      {!hasNarrowingFilters && ORDER_MANAGE_EMPTY_MESSAGES[filters.tab]}
      {hasNarrowingFilters && (
        <Button
          variant="ghost"
          onClick={onClearFilters}
          className={clearButtonClassName}
        >
          {filters.isFree && "Xoá lọc"}
          {!filters.isFree && "Xoá tìm kiếm"}
        </Button>
      )}
    </p>
  );
}
