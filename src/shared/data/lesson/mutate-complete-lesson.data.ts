import { handleCompleteLesson } from "@/shared/actions/history";
import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { invalidateQueriesByKeys } from "@/shared/helpers/query-helper";
import { useMutation } from "@tanstack/react-query";

export function useMutationCompleteLesson() {
  return useMutation({
    mutationFn: handleCompleteLesson,
    mutationKey: [QUERY_KEYS.COMPLETE_LESSON],
    onSuccess: () => {
      invalidateQueriesByKeys(QUERY_KEYS.GET_HISTORIES_BY_USER);
    },
  });
}
