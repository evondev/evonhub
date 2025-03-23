import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { invalidateQueriesByKeys } from "@/shared/helpers/query-helper";
import { useMutation } from "@tanstack/react-query";
import { handleRatingStatus } from "../../actions";

export function userMutationRatingStatus() {
  return useMutation({
    mutationFn: handleRatingStatus,
    mutationKey: [QUERY_KEYS.HANDLE_RATING_STATUS],
    onSuccess: () => {
      invalidateQueriesByKeys(QUERY_KEYS.GET_RATINGS);
    },
  });
}
