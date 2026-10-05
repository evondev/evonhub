"use client";

import { LoadErrorState } from "@/shared/components/common";
import { useRef, useState } from "react";
import { ORDER_MANAGE_DEFAULT_FILTERS } from "../../../constants/order-manage.constants";
import {
  OrderManageFilters,
  OrderManagePendingAction,
  OrderManageResult,
  OrderManageRow,
  OrderManageTab,
} from "../../../types/order-manage.types";
import { buildOrderManageTabs } from "../../../utils/order-manage.utils";
import { FreeOrdersConfirmDialog } from "./free-orders-confirm-dialog";
import { OrderConfirmDialog } from "./order-confirm-dialog";
import { OrderManageResults } from "./order-manage-results";
import { OrderManageSkeleton } from "./order-manage-skeleton";
import { OrderManageToolbar } from "./order-manage-toolbar";

export interface OrderManageViewProps {
  filters: OrderManageFilters;
  onFiltersChange: (changes: Partial<OrderManageFilters>) => void;
  result?: OrderManageResult;
  pageSize: number;
  /** Mốc "bây giờ" để tính đơn chờ còn bao lâu, đã quá 24 giờ chưa */
  referenceTime: number;
  isLoading: boolean;
  isError: boolean;
  /** Đã có dòng trên màn, đang tải trang/bộ lọc mới */
  isRefreshing: boolean;
  onRetry: () => void;
  /** Chỉ admin duyệt hàng loạt được đơn miễn phí */
  canApproveFreeOrders: boolean;
  isApprovingFreeOrders: boolean;
  /** Trả true khi đã duyệt xong, để đóng hộp xác nhận */
  onApproveFreeOrders: () => Promise<boolean>;
  /** Đơn đang chờ xác nhận duyệt hoặc từ chối */
  pendingAction: OrderManagePendingAction | null;
  isConfirmingAction: boolean;
  onActionRequest: (pendingAction: OrderManagePendingAction) => void;
  onActionConfirm: () => void;
  onActionCancel: () => void;
}

const orderListId = "order-manage-list";

export function OrderManageView({
  filters,
  onFiltersChange,
  result,
  pageSize,
  referenceTime,
  isLoading,
  isError,
  isRefreshing,
  onRetry,
  canApproveFreeOrders,
  isApprovingFreeOrders,
  onApproveFreeOrders,
  pendingAction,
  isConfirmingAction,
  onActionRequest,
  onActionConfirm,
  onActionCancel,
}: OrderManageViewProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isFreeConfirmOpen, setIsFreeConfirmOpen] = useState(false);
  const freePendingCount = canApproveFreeOrders
    ? result?.freePendingCount || 0
    : 0;

  function handleTabChange(tab: OrderManageTab) {
    onFiltersChange({ tab, page: 1 });
  }

  function handleSearch(search: string) {
    if (search === filters.search) return;

    onFiltersChange({ search, page: 1 });
  }

  function handleFreeToggle() {
    onFiltersChange({ isFree: !filters.isFree, page: 1 });
  }

  function handlePageChange(page: number) {
    onFiltersChange({ page });
    window.scrollTo({ top: 0 });
  }

  // Gỡ từ khoá và lọc miễn phí, giữ tab đang xem
  function handleClearFilters() {
    onFiltersChange({
      search: ORDER_MANAGE_DEFAULT_FILTERS.search,
      isFree: ORDER_MANAGE_DEFAULT_FILTERS.isFree,
      page: 1,
    });
    searchInputRef.current?.focus();
  }

  async function handleConfirmFreeOrders() {
    const isApproved = await onApproveFreeOrders();

    if (isApproved) setIsFreeConfirmOpen(false);
  }

  function handleCancelFreeOrders() {
    if (isApprovingFreeOrders) return;

    setIsFreeConfirmOpen(false);
  }

  function handleApprove(order: OrderManageRow) {
    onActionRequest({ order, action: "approve" });
  }

  function handleReject(order: OrderManageRow) {
    onActionRequest({ order, action: "reject" });
  }

  return (
    <div className="flex flex-col gap-4">
      <OrderManageToolbar
        tabs={buildOrderManageTabs(result?.tabCounts)}
        activeTab={filters.tab}
        search={filters.search}
        isFree={filters.isFree}
        freePendingCount={freePendingCount}
        onTabChange={handleTabChange}
        onSearch={handleSearch}
        onFreeToggle={handleFreeToggle}
        onApproveFreeOrders={() => setIsFreeConfirmOpen(true)}
        searchInputRef={searchInputRef}
        controlsId={orderListId}
      />
      {isLoading && <OrderManageSkeleton />}
      {!isLoading && isError && (
        <LoadErrorState
          title="Chưa tải được danh sách đơn hàng"
          onRetry={onRetry}
        />
      )}
      {!isLoading && !isError && result && (
        <OrderManageResults
          id={orderListId}
          result={result}
          filters={filters}
          pageSize={pageSize}
          referenceTime={referenceTime}
          isRefreshing={isRefreshing}
          isActionDisabled={isConfirmingAction}
          onApprove={handleApprove}
          onReject={handleReject}
          onPageChange={handlePageChange}
          onClearFilters={handleClearFilters}
        />
      )}
      <FreeOrdersConfirmDialog
        isOpen={isFreeConfirmOpen}
        count={freePendingCount}
        isConfirming={isApprovingFreeOrders}
        onConfirm={handleConfirmFreeOrders}
        onCancel={handleCancelFreeOrders}
      />
      <OrderConfirmDialog
        pendingAction={pendingAction}
        isConfirming={isConfirmingAction}
        onConfirm={onActionConfirm}
        onCancel={onActionCancel}
      />
    </div>
  );
}
