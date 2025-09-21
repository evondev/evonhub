import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { invalidateQueriesByKeys } from "@/shared/helpers/query-helper";
import { useMutation } from "@tanstack/react-query";
import { syncUserLeaderboard } from "../../actions";

export function useMutationSyncLeaderboard() {
  return useMutation({
    mutationFn: syncUserLeaderboard,
    mutationKey: [QUERY_KEYS.SYNC_USER_LEADERBOARD],
    onSuccess: () => {
      invalidateQueriesByKeys([QUERY_KEYS.GET_LEADERBOARD]);
    },
  });
}
