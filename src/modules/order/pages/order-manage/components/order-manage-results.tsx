import { TablePagination } from "@/shared/components/common";
import { cn } from "@/shared/utils";
import {
  OrderManageFilters,
  OrderManageResult,
  OrderManageRow,
} from "../../../types/order-manage.types";
import { OrderListItem } from "./order-list-item";
import { OrderManageEmpty } from "./order-manage-empty";
import { OrderTable } from "./order-table";

interface OrderManageResultsProps {
  id: string;
  result: OrderManageResult;
  filters: OrderManageFilters;
  pageSize: number;
  referenceTime: number;
  /** Đang tải trang hoặc bộ lọc mới, vẫn giữ dòng cũ trên màn */
  isRefreshing: boolean;
  isActionDisabled: boolean;
  onApprove: (order: OrderManageRow) => void;
  onReject: (order: OrderManageRow) => void;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
}

/**
 * Một khung: bảng từ xl, danh sách dòng khi hẹp hơn, phân trang ở đáy.
 * Không có đơn thì bảng chỉ còn hàng tiêu đề và một dòng chữ mờ
 */
export function OrderManageResults({
  id,
  result,
  filters,
  pageSize,
  referenceTime,
  isRefreshing,
  isActionDisabled,
  onApprove,
  onReject,
  onPageChange,
  onClearFilters,
}: OrderManageResultsProps) {
  const hasOrders = result.orders.length > 0;

  return (
    <section
      id={id}
      aria-label="Danh sách đơn hàng"
      aria-busy={isRefreshing}
      className="overflow-clip rounded-2xl border border-border bg-surface"
    >
      <div className={cn("transition-opacity", isRefreshing && "opacity-60")}>
        <OrderTable
          orders={result.orders}
          referenceTime={referenceTime}
          isActionDisabled={isActionDisabled}
          onApprove={onApprove}
          onReject={onReject}
          className="hidden xl:table"
        />
        {hasOrders && (
          <ul className="xl:hidden">
            {result.orders.map((order) => (
              <OrderListItem
                key={order.id}
                order={order}
                referenceTime={referenceTime}
                isActionDisabled={isActionDisabled}
                onApprove={() => onApprove(order)}
                onReject={() => onReject(order)}
              />
            ))}
          </ul>
        )}
      </div>
      {!hasOrders && (
        <OrderManageEmpty filters={filters} onClearFilters={onClearFilters} />
      )}
      {hasOrders && (
        <TablePagination
          page={filters.page}
          pageSize={pageSize}
          total={result.total}
          itemLabel="đơn hàng"
          onPageChange={onPageChange}
        />
      )}
    </section>
  );
}
