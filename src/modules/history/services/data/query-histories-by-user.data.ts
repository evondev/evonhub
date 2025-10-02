import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchHistoriesByUserId } from "../../actions";

interface GetHistoriesByUserProps {
  userId: string;
  courseId: string;
}

export function getHistoriesByUserOptions({
  userId,
  courseId,
}: GetHistoriesByUserProps) {
  return queryOptions({
    enabled: !!userId && !!courseId,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchHistoriesByUserId({ userId, courseId });

      return response;
    },
    queryKey: [QUERY_KEYS.GET_HISTORIES_BY_USER, userId, courseId],
  });
}

export function useQueryHistoriesByUser({
  userId,
  courseId,
}: GetHistoriesByUserProps) {
  const options = getHistoriesByUserOptions({ userId, courseId });

  return useQuery(options);
}
