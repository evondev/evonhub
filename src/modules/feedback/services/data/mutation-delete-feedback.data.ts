import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { invalidateQueriesByKeys } from "@/shared/helpers/query-helper";
import { useMutation } from "@tanstack/react-query";
import { deleteFeedback } from "../../actions";

export function useMutationDeleteFeedback() {
  return useMutation({
    mutationFn: deleteFeedback,
    mutationKey: [QUERY_KEYS.HANDLE_DELETE_FEEDBACK],
    onSuccess: (result) => {
      if (result.isSuccess) invalidateQueriesByKeys(QUERY_KEYS.GET_FEEDBACKS);
    },
  });
}
