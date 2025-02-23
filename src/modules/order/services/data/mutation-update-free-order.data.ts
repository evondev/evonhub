import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { invalidateQueriesByKeys } from "@/shared/helpers/query-helper";
import { useMutation } from "@tanstack/react-query";
import { handleUpdateFreeOrder } from "../../actions";

export function userMutationUpdateFreeOrder() {
  return useMutation({
    mutationFn: handleUpdateFreeOrder,
    mutationKey: [QUERY_KEYS.HANDLE_UPDATE_FREE_ORDER],
    onSuccess: () => {
      invalidateQueriesByKeys(QUERY_KEYS.GET_ORDERS);
    },
  });
}
