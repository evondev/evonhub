import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { invalidateQueriesByKeys } from "@/shared/helpers/query-helper";
import { useMutation } from "@tanstack/react-query";
import { updateMicro } from "../../actions";

export function userMutationUpdateMicro() {
  return useMutation({
    mutationFn: updateMicro,
    mutationKey: [QUERY_KEYS.HANDLE_UPDATE_MICRO],
    onSuccess: () => {
      invalidateQueriesByKeys(
        QUERY_KEYS.GET_MICROS,
        QUERY_KEYS.GET_MICRO_BY_SLUG,
      );
    },
  });
}
