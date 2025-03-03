import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchCoupons } from "../../actions";

interface GetCouponsProps {}

export function getCouponsOptions({}: GetCouponsProps) {
  return queryOptions({
    enabled: true,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchCoupons();

      return response;
    },
    queryKey: [QUERY_KEYS.GET_COUPONS],
  });
}

export function useQueryCoupons({}: GetCouponsProps) {
  const options = getCouponsOptions({});

  return useQuery(options);
}
