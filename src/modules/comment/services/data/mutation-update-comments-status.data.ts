import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { invalidateQueriesByKeys } from "@/shared/helpers/query-helper";
import { useMutation } from "@tanstack/react-query";
import { updateCommentsStatus } from "../../actions";

export function useMutationUpdateCommentsStatus() {
  return useMutation({
    mutationFn: updateCommentsStatus,
    mutationKey: [QUERY_KEYS.HANDLE_UPDATE_COMMENT],
    onSuccess: (result) => {
      if (result.isSuccess) invalidateQueriesByKeys(QUERY_KEYS.GET_COMMENTS);
    },
  });
}
