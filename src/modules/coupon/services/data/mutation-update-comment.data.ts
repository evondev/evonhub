import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { invalidateQueriesByKeys } from "@/shared/helpers/query-helper";
import { useMutation } from "@tanstack/react-query";
import { handleUpdateComment } from "../../actions";

export function userMutationUpdateComment() {
  return useMutation({
    mutationFn: handleUpdateComment,
    mutationKey: [QUERY_KEYS.HANDLE_UPDATE_COMMENT],
    onSuccess: () => {
      invalidateQueriesByKeys(QUERY_KEYS.GET_COMMENTS);
    },
  });
}
