import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { invalidateQueriesByKeys } from "@/shared/helpers/query-helper";
import { useMutation } from "@tanstack/react-query";
import { createMicro } from "../../actions";

export function useMutationCreateMicro() {
  return useMutation({
    mutationFn: createMicro,
    mutationKey: [QUERY_KEYS.HANDLE_CREATE_MICRO],
    onSuccess: () => {
      invalidateQueriesByKeys(QUERY_KEYS.GET_MICROS);
    },
  });
}
