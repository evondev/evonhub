import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { invalidateQueriesByKeys } from "@/shared/helpers/query-helper";
import { useMutation } from "@tanstack/react-query";
import { deleteRejectedComments } from "../../actions";

/** Xoá vĩnh viễn mọi bình luận đã từ chối khớp bộ lọc đang xem */
export function useMutationDeleteRejectedComments() {
  return useMutation({
    mutationFn: deleteRejectedComments,
    mutationKey: [QUERY_KEYS.HANDLE_DELETE_REJECTED_COMMENTS],
    onSuccess: (result) => {
      if (result.isSuccess) invalidateQueriesByKeys(QUERY_KEYS.GET_COMMENTS);
    },
  });
}
