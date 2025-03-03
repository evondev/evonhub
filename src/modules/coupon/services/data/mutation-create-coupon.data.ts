import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { invalidateQueriesByKeys } from "@/shared/helpers/query-helper";
import { useMutation } from "@tanstack/react-query";
import { handleCreateCoupon } from "../../actions";

export function userMutationCreateCoupon() {
  return useMutation({
    mutationFn: handleCreateCoupon,
    mutationKey: [QUERY_KEYS.HANDLE_CREATE_COUPON],
    onSuccess: () => {
      invalidateQueriesByKeys(QUERY_KEYS.GET_COUPONS);
    },
  });
}
