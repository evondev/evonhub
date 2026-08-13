import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { OrderStatus } from "@/shared/constants/order.constants";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchOrderStatus } from "../../actions";

interface GetOrderStatusProps {
  code: string;
  /** Dừng hỏi lại khi đơn đã được duyệt */
  refetchInterval?: number;
}

export function getOrderStatusOptions({
  code,
  refetchInterval = 5000,
}: GetOrderStatusProps) {
  return queryOptions({
    enabled: !!code,
    refetchInterval: (query) =>
      query.state.data === OrderStatus.Approved ? false : refetchInterval,
    queryFn: async () => {
      const response = await fetchOrderStatus({ code });

      return response ?? null;
    },
    queryKey: [QUERY_KEYS.GET_ORDER_STATUS, code],
  });
}

export function useQueryOrderStatus({ code }: GetOrderStatusProps) {
  const options = getOrderStatusOptions({ code });

  return useQuery(options);
}
