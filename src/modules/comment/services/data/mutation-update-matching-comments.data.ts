import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { invalidateQueriesByKeys } from "@/shared/helpers/query-helper";
import { useMutation } from "@tanstack/react-query";
import { updateMatchingCommentsStatus } from "../../actions";

/** Duyệt / từ chối mọi bình luận khớp bộ lọc đang xem */
export function useMutationUpdateMatchingComments() {
  return useMutation({
    mutationFn: updateMatchingCommentsStatus,
    mutationKey: [QUERY_KEYS.HANDLE_UPDATE_COMMENT],
    onSuccess: (result) => {
      if (result.isSuccess) invalidateQueriesByKeys(QUERY_KEYS.GET_COMMENTS);
    },
  });
}
