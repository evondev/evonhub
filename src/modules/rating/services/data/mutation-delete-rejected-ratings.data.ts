import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { invalidateQueriesByKeys } from "@/shared/helpers/query-helper";
import { useMutation } from "@tanstack/react-query";
import { deleteRejectedRatings } from "../../actions";

/** Xoá vĩnh viễn mọi đánh giá đã từ chối khớp bộ lọc đang xem */
export function useMutationDeleteRejectedRatings() {
  return useMutation({
    mutationFn: deleteRejectedRatings,
    mutationKey: [QUERY_KEYS.HANDLE_DELETE_REJECTED_RATINGS],
    onSuccess: (result) => {
      if (result.isSuccess) invalidateQueriesByKeys(QUERY_KEYS.GET_RATINGS);
    },
  });
}
