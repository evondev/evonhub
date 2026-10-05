"use client";

import { PreviewStateSwitcher } from "@/shared/components/common";
import { ITEMS_PER_PAGE } from "@/shared/constants/common.constants";
import { OrderStatus } from "@/shared/constants/order.constants";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  ORDER_MANAGE_DEFAULT_FILTERS,
  ORDER_MANAGE_PREVIEW_EMPTY_KEYWORD,
  ORDER_MANAGE_PREVIEW_SAVE_DELAY_MS,
  ORDER_MANAGE_PREVIEW_STATE_LINKS,
  ORDER_MANAGE_PREVIEW_TAB_COUNTS,
} from "../../constants/order-manage.constants";
import { useOrderAction } from "../../hooks/use-order-action";
import {
  OrderManageFilters,
  OrderManagePreviewState,
  OrderManageRow,
} from "../../types/order-manage.types";
import {
  buildPreviewManageOrders,
  countPreviewOrderTabs,
  getOrderStatusForAction,
  isPreviewOrderInTab,
  isPreviewOrderMatching,
} from "../../utils/order-manage.utils";
import { OrderManageView } from "./components";

interface OrderManagePreviewPageProps {
  state: OrderManagePreviewState;
  /** Mốc "bây giờ" do server chốt, để giờ của đơn giả khớp giữa server và trình duyệt */
  referenceTime: number;
}

function waitForPreviewSave() {
  return new Promise((resolve) =>
    setTimeout(resolve, ORDER_MANAGE_PREVIEW_SAVE_DELAY_MS),
  );
}

/** Trang xem trước "Quản lý đơn hàng" bằng đơn giả. Không đọc DB, chỉ mở ở dev */
export function OrderManagePreviewPage({
  state,
  referenceTime,
}: OrderManagePreviewPageProps) {
  const [initialOrders] = useState(() =>
    buildPreviewManageOrders(new Date(referenceTime)),
  );
  const [previewOrders, setPreviewOrders] = useState(initialOrders);
  const previewNow = new Date(referenceTime);
  const [filters, setFilters] = useState<OrderManageFilters>({
    ...ORDER_MANAGE_DEFAULT_FILTERS,
    search: state === "rong" ? ORDER_MANAGE_PREVIEW_EMPTY_KEYWORD : "",
  });
  const [isApprovingFreeOrders, setIsApprovingFreeOrders] = useState(false);
  const freePendingCount = previewOrders.filter(
    (order) => order.status === OrderStatus.Pending && order.total <= 0,
  ).length;
  const matchedOrders = previewOrders.filter(
    (order) =>
      isPreviewOrderMatching(order, filters) &&
      isPreviewOrderInTab(order, filters.tab, previewNow),
  );
  const hasNarrowingFilters = Boolean(filters.search || filters.isFree);
  const hasChangedOrders = previewOrders !== initialOrders;
  // Chưa tìm, chưa lọc, chưa đổi gì thì giả như đang xem cả danh sách thật
  const tabCounts =
    hasNarrowingFilters || hasChangedOrders
      ? countPreviewOrderTabs(previewOrders, filters, previewNow)
      : ORDER_MANAGE_PREVIEW_TAB_COUNTS;

  function handleFiltersChange(changes: Partial<OrderManageFilters>) {
    setFilters((currentFilters) => ({ ...currentFilters, ...changes }));
  }

  function updatePreviewOrders(
    isTarget: (order: OrderManageRow) => boolean,
    status: OrderStatus,
  ) {
    setPreviewOrders((currentOrders) =>
      currentOrders.map((order) =>
        isTarget(order) ? { ...order, status } : order,
      ),
    );
  }

  // Giả lập server: chờ một nhịp rồi đổi trạng thái trên danh sách giả
  const orderAction = useOrderAction({
    changeStatus: async (targetOrder, action) => {
      await waitForPreviewSave();
      updatePreviewOrders(
        (order) => order.id === targetOrder.id,
        getOrderStatusForAction(action),
      );

      return true;
    },
  });

  async function handleApproveFreeOrders(): Promise<boolean> {
    setIsApprovingFreeOrders(true);
    await waitForPreviewSave();
    updatePreviewOrders(
      (order) => order.status === OrderStatus.Pending && order.total <= 0,
      OrderStatus.Approved,
    );
    setIsApprovingFreeOrders(false);
    toast.success(`Đã duyệt ${freePendingCount} đơn miễn phí`);

    return true;
  }

  function handleRetry() {}

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <PreviewStateSwitcher
        links={ORDER_MANAGE_PREVIEW_STATE_LINKS}
        currentState={state}
      />
      <OrderManageView
        filters={filters}
        onFiltersChange={handleFiltersChange}
        result={{
          orders: matchedOrders.slice(0, ITEMS_PER_PAGE),
          total: tabCounts[filters.tab],
          tabCounts,
          freePendingCount,
        }}
        pageSize={ITEMS_PER_PAGE}
        referenceTime={referenceTime}
        isLoading={state === "dang-tai"}
        isError={state === "loi"}
        isRefreshing={false}
        onRetry={handleRetry}
        canApproveFreeOrders
        isApprovingFreeOrders={isApprovingFreeOrders}
        onApproveFreeOrders={handleApproveFreeOrders}
        pendingAction={orderAction.pendingAction}
        isConfirmingAction={orderAction.isConfirming}
        onActionRequest={orderAction.handleRequest}
        onActionConfirm={orderAction.handleConfirm}
        onActionCancel={orderAction.handleCancel}
      />
    </div>
  );
}
