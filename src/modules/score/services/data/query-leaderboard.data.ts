import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchLeaderBoard } from "../../actions";

interface UseQueryLeaderBoardProps {
  limit?: number;
}

export function useQueryLeaderboard(props: UseQueryLeaderBoardProps) {
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchLeaderBoard({
        limit: props?.limit || 5,
      });

      return response;
    },
    queryKey: [QUERY_KEYS.GET_LEADERBOARD, props.limit],
  });
}
