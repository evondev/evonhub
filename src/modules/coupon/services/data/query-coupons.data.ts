import { CouponStatus } from "@/shared/constants/coupon.constants";
import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchCoupons } from "../../actions";

interface GetCouponsProps {
  status?: CouponStatus;
  shouldFilterOutdated?: boolean;
}

export function getCouponsOptions({
  status,
  shouldFilterOutdated,
}: GetCouponsProps) {
  return queryOptions({
    enabled: true,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchCoupons({ status, shouldFilterOutdated });

      return response;
    },
    queryKey: [QUERY_KEYS.GET_COUPONS],
  });
}

export function useQueryCoupons({
  status,
  shouldFilterOutdated,
}: GetCouponsProps) {
  const options = getCouponsOptions({ status, shouldFilterOutdated });

  return useQuery(options);
}
