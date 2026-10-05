import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { invalidateQueriesByKeys } from "@/shared/helpers/query-helper";
import { useMutation } from "@tanstack/react-query";
import { updateRatingsStatus } from "../../actions";

export function useMutationUpdateRatingsStatus() {
  return useMutation({
    mutationFn: updateRatingsStatus,
    mutationKey: [QUERY_KEYS.HANDLE_RATING_STATUS],
    onSuccess: (result) => {
      if (result.isSuccess) invalidateQueriesByKeys(QUERY_KEYS.GET_RATINGS);
    },
  });
}
