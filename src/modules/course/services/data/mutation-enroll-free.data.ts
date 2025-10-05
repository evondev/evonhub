import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { invalidateQueriesByKeys } from "@/shared/helpers/query-helper";
import { useMutation } from "@tanstack/react-query";
import { handleEnrollFree } from "../../actions";

export function userMutationEnrollFree() {
  return useMutation({
    mutationFn: handleEnrollFree,
    mutationKey: [QUERY_KEYS.HANDLE_ENROLL_FREE],
    onSuccess: () => {
      invalidateQueriesByKeys(
        QUERY_KEYS.GET_USER_COURSES,
        QUERY_KEYS.GET_USER_BY_ID,
        QUERY_KEYS.GET_USER_COURSE_CONTINUE,
        QUERY_KEYS.GET_LEADERBOARD
      );
    },
  });
}
