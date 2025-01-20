import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { invalidateQueriesByKeys } from "@/shared/helpers/query-helper";
import { useMutation } from "@tanstack/react-query";
import { handleEnrollPackage } from "../../actions";

export function userMutationEnrollPackage() {
  return useMutation({
    mutationFn: handleEnrollPackage,
    mutationKey: [QUERY_KEYS.HANDLE_ENROLL_PACKAGE],
    onSuccess: () => {
      invalidateQueriesByKeys(
        QUERY_KEYS.GET_USER_COURSES,
        QUERY_KEYS.GET_USER_BY_ID
      );
    },
  });
}
