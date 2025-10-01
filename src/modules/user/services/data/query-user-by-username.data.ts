import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchUserByUsername } from "../../actions";

interface GetUserByUsernameProps {
  username: string;
}

export function useQueryUserByUsername({ username }: GetUserByUsernameProps) {
  const options = queryOptions({
    enabled: !!username,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchUserByUsername({ username });

      return response;
    },
    queryKey: [QUERY_KEYS.GET_USER_BY_USERNAME, username],
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  return useQuery(options);
}
