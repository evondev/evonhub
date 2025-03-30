import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchCouponByCode } from "../../actions";

interface GetCouponByCodeProps {
  code: string;
}

export function getCouponByCodeOptions({ code }: GetCouponByCodeProps) {
  return queryOptions({
    enabled: true,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchCouponByCode({ code });

      return response;
    },
    queryKey: [QUERY_KEYS.GET_COUPON_BY_CODE, code],
  });
}

export function useQueryCouponByCode({ code }: GetCouponByCodeProps) {
  const options = getCouponByCodeOptions({ code });

  return useQuery(options);
}
