import { getQueryClient } from "../libs/react-query/query-client";
import { toArray } from "./array-helper";

export function invalidateQueriesByKeys(
  ...queryKeys: Array<unknown[] | unknown>
) {
  const queryClient = getQueryClient();

  for (const key of queryKeys) {
    queryClient.invalidateQueries({
      queryKey: toArray(key),
    });
  }
}
