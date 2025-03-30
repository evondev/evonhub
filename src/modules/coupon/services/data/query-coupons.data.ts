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
}

export function getCouponsOptions({ status }: GetCouponsProps) {
  return queryOptions({
    enabled: true,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchCoupons({ status });

      return response;
    },
    queryKey: [QUERY_KEYS.GET_COUPONS],
  });
}

export function useQueryCoupons({ status }: GetCouponsProps) {
  const options = getCouponsOptions({ status });

  return useQuery(options);
}
