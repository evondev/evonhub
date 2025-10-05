import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { invalidateQueriesByKeys } from "@/shared/helpers/query-helper";
import { useMutation } from "@tanstack/react-query";
import { handleEnrollCourse } from "../../actions";

export function userMutationEnrollCourse() {
  return useMutation({
    mutationFn: handleEnrollCourse,
    mutationKey: [QUERY_KEYS.HANDLE_ENROLL_COURSE],
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
