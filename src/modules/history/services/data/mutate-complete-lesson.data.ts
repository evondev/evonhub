import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { invalidateQueriesByKeys } from "@/shared/helpers/query-helper";
import { useMutation } from "@tanstack/react-query";
import { handleCompleteLesson } from "../../actions";

export function useMutationCompleteLesson() {
  return useMutation({
    mutationFn: handleCompleteLesson,
    mutationKey: [QUERY_KEYS.COMPLETE_LESSON],
    onSuccess: (response) => {
      if (response) {
        invalidateQueriesByKeys(QUERY_KEYS.GET_HISTORIES_BY_USER);
      }
    },
  });
}
