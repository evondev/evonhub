import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { invalidateQueriesByKeys } from "@/shared/helpers/query-helper";
import { useMutation } from "@tanstack/react-query";
import { handleUpdateOrder } from "../../actions";

export function userMutationUpdateOrder() {
  return useMutation({
    mutationFn: handleUpdateOrder,
    mutationKey: [QUERY_KEYS.HANDLE_UPDATE_ORDER],
    onSuccess: () => {
      invalidateQueriesByKeys(QUERY_KEYS.GET_ORDERS);
    },
  });
}
