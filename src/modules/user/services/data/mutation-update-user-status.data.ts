import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { invalidateQueriesByKeys } from "@/shared/helpers/query-helper";
import { useMutation } from "@tanstack/react-query";
import { updateUserStatus } from "../../actions";

export function useMutationUpdateUserStatus() {
  return useMutation({
    mutationFn: updateUserStatus,
    mutationKey: [QUERY_KEYS.HANDLE_UPDATE_USER_STATUS],
    onSuccess: (result) => {
      if (result.isSuccess) invalidateQueriesByKeys(QUERY_KEYS.GET_USERS);
    },
  });
}
