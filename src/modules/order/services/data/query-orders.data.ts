import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchOrders } from "../../actions";
import { FetchOrdersProps } from "../../types";

interface GetOrdersProps extends FetchOrdersProps {
  enabled?: boolean;
}

export function getOrdersOptions({ enabled, ...props }: GetOrdersProps) {
  return queryOptions({
    enabled,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchOrders({ ...props });

      return response;
    },
    queryKey: [QUERY_KEYS.GET_ORDERS, props],
  });
}

export function useQueryOrders({ enabled, ...props }: GetOrdersProps) {
  const options = getOrdersOptions({ enabled, ...props });

  return useQuery(options);
}
