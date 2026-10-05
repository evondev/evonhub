"use client";

import { useUserContext } from "@/components/user-context";
import { ITEMS_PER_PAGE } from "@/shared/constants/common.constants";
import { UserRole } from "@/shared/constants/user.constants";
import { formatThoundsand } from "@/shared/utils";
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import { toast } from "react-toastify";
import {
  ORDER_MANAGE_DEFAULT_FILTERS,
  ORDER_MANAGE_TAB_VALUES,
} from "../../constants/order-manage.constants";
import { useOrderAction } from "../../hooks/use-order-action";
import { userMutationUpdateFreeOrder } from "../../services/data/mutation-update-free-order.data";
import { userMutationUpdateOrder } from "../../services/data/mutation-update-order.data";
import { useQueryOrders } from "../../services/data/query-orders.data";
import {
  getOrderStatusForAction,
  toOrderManageRow,
} from "../../utils/order-manage.utils";
import { OrderManageView } from "./components";

export interface OrderManagePageProps {}

export function OrderManagePage(_props: OrderManagePageProps) {
  const { userInfo } = useUserContext();
  const canAccess =
    !!userInfo?._id &&
    [UserRole.Admin, UserRole.Expert].includes(userInfo.role);

  const [filters, setFilters] = useQueryStates({
    search: parseAsString.withDefault(ORDER_MANAGE_DEFAULT_FILTERS.search),
    tab: parseAsStringLiteral(ORDER_MANAGE_TAB_VALUES).withDefault(
      ORDER_MANAGE_DEFAULT_FILTERS.tab,
    ),
    isFree: parseAsBoolean.withDefault(ORDER_MANAGE_DEFAULT_FILTERS.isFree),
    page: parseAsInteger.withDefault(ORDER_MANAGE_DEFAULT_FILTERS.page),
  });

  const {
    data,
    isPending,
    isPlaceholderData,
    isFetching,
    dataUpdatedAt,
    refetch,
  } = useQueryOrders({
    enabled: canAccess,
    limit: ITEMS_PER_PAGE,
    page: filters.page,
    filter: filters.search,
    isFree: filters.isFree,
    tab: filters.tab,
  });
  const mutationUpdateOrder = userMutationUpdateOrder();
  const mutationUpdateFreeOrder = userMutationUpdateFreeOrder();

  const orderAction = useOrderAction({
    changeStatus: async (order, action) => {
      const isSaved = await mutationUpdateOrder.mutateAsync({
        code: order.code,
        status: getOrderStatusForAction(action),
      });

      return Boolean(isSaved);
    },
  });

  if (!canAccess) return null;

  async function handleApproveFreeOrders(): Promise<boolean> {
    const approvedCount = await mutationUpdateFreeOrder.mutateAsync();

    if (approvedCount === undefined) {
      toast.error("Chưa duyệt được đơn miễn phí, thử lại sau ít phút");
      return false;
    }

    toast.success(`Đã duyệt ${formatThoundsand(approvedCount)} đơn miễn phí`);
    return true;
  }

  // fetchOrders trả undefined khi lỗi
  const result = data && {
    orders: data.orders.map(toOrderManageRow),
    total: data.total,
    tabCounts: data.tabCounts,
    freePendingCount: data.freePendingCount,
  };

  return (
    <OrderManageView
      filters={filters}
      onFiltersChange={setFilters}
      result={result}
      pageSize={ITEMS_PER_PAGE}
      referenceTime={dataUpdatedAt || Date.now()}
      isLoading={isPending}
      isError={!isPending && !data}
      isRefreshing={isPlaceholderData && isFetching}
      onRetry={refetch}
      canApproveFreeOrders={userInfo?.role === UserRole.Admin}
      isApprovingFreeOrders={mutationUpdateFreeOrder.isPending}
      onApproveFreeOrders={handleApproveFreeOrders}
      pendingAction={orderAction.pendingAction}
      isConfirmingAction={orderAction.isConfirming}
      onActionRequest={orderAction.handleRequest}
      onActionConfirm={orderAction.handleConfirm}
      onActionCancel={orderAction.handleCancel}
    />
  );
}
