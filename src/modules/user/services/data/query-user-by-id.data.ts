import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchUserById } from "../../actions";

interface GetUserByIdProps {
  userId: string;
}

export function getUserByIdOptions({ userId }: GetUserByIdProps) {
  return queryOptions({
    enabled: !!userId,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchUserById({ userId });

      return response;
    },
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useQueryUserById({ userId }: GetUserByIdProps) {
  const options = getUserByIdOptions({ userId });

  return useQuery(options);
}
