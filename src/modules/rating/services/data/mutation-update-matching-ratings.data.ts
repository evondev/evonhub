import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { invalidateQueriesByKeys } from "@/shared/helpers/query-helper";
import { useMutation } from "@tanstack/react-query";
import { updateMatchingRatingsStatus } from "../../actions";

/** Duyệt / từ chối mọi đánh giá khớp bộ lọc đang xem */
export function useMutationUpdateMatchingRatings() {
  return useMutation({
    mutationFn: updateMatchingRatingsStatus,
    mutationKey: [QUERY_KEYS.HANDLE_RATING_STATUS],
    onSuccess: (result) => {
      if (result.isSuccess) invalidateQueriesByKeys(QUERY_KEYS.GET_RATINGS);
    },
  });
}
