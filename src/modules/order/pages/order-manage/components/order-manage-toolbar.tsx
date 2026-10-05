import { FilterTabs, SearchInput } from "@/shared/components/common";
import { FilterTabItem } from "@/shared/types";
import { RefObject } from "react";
import { ORDER_MANAGE_SEARCH_PLACEHOLDER } from "../../../constants/order-manage.constants";
import { OrderManageTab } from "../../../types/order-manage.types";
import { ApproveFreeOrdersButton } from "./approve-free-orders-button";
import { FreeOrderChip } from "./free-order-chip";

interface OrderManageToolbarProps {
  tabs: FilterTabItem<OrderManageTab>[];
  activeTab: OrderManageTab;
  search: string;
  isFree: boolean;
  /** Số đơn 0 đồng đang chờ admin duyệt; 0 (hoặc không phải admin) thì không có nút */
  freePendingCount: number;
  onTabChange: (tab: OrderManageTab) => void;
  onSearch: (keyword: string) => void;
  onFreeToggle: () => void;
  onApproveFreeOrders: () => void;
  searchInputRef: RefObject<HTMLInputElement>;
  /** id của danh sách mà tab đang lọc */
  controlsId: string;
}

/**
 * Từ xl: hàng trên là sáu tab trạng thái; hàng dưới là ô tìm, chip Miễn phí,
 * nút duyệt đơn miễn phí dạt phải. Hẹp hơn sáu tab không vừa: hàng trên là nút
 * "Trạng thái:" cạnh chip. Dưới sm ô tìm lên đầu, nút duyệt rộng hết ở cuối
 */
export function OrderManageToolbar({
  tabs,
  activeTab,
  search,
  isFree,
  freePendingCount,
  onTabChange,
  onSearch,
  onFreeToggle,
  onApproveFreeOrders,
  searchInputRef,
  controlsId,
}: OrderManageToolbarProps) {
  const hasFreePendingOrders = freePendingCount > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <FilterTabs
          tabs={tabs}
          activeValue={activeTab}
          onChange={onTabChange}
          controlsId={controlsId}
          collapseBelow="xl"
        />
        <FreeOrderChip
          isActive={isFree}
          onToggle={onFreeToggle}
          className="xl:hidden"
        />
      </div>
      <div className="order-first flex items-center gap-2 sm:order-none">
        <SearchInput
          ref={searchInputRef}
          value={search}
          onSearch={onSearch}
          placeholder={ORDER_MANAGE_SEARCH_PLACEHOLDER}
          label="Tìm đơn hàng"
          className="flex-1 sm:w-72 sm:flex-none"
        />
        <FreeOrderChip
          isActive={isFree}
          onToggle={onFreeToggle}
          className="hidden xl:inline-flex"
        />
        {hasFreePendingOrders && (
          <ApproveFreeOrdersButton
            count={freePendingCount}
            onClick={onApproveFreeOrders}
            className="ml-auto hidden shrink-0 sm:inline-flex"
          />
        )}
      </div>
      {hasFreePendingOrders && (
        <ApproveFreeOrdersButton
          count={freePendingCount}
          onClick={onApproveFreeOrders}
          className="h-11 w-full sm:hidden"
        />
      )}
    </div>
  );
}
