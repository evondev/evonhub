import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchLeaderBoard } from "../../actions";

export function useQueryLeaderboard() {
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchLeaderBoard();

      return response;
    },
    queryKey: [QUERY_KEYS.GET_LEADERBOARD],
  });
}
