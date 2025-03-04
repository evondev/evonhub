import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchNotificationsByUser } from "../../actions";

interface GetNotificationsByUserProps {
  userId: string;
  enabled?: boolean;
}

export function getNotificationsByUserOptions({
  userId,
  enabled,
}: GetNotificationsByUserProps) {
  return queryOptions({
    enabled,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchNotificationsByUser(userId);

      return response;
    },
    queryKey: [QUERY_KEYS.GET_NOTIFICATIONS_BY_USER, userId],
  });
}

export function useQueryNotificationsByUser({
  userId,
  enabled,
}: GetNotificationsByUserProps) {
  const options = getNotificationsByUserOptions({ userId, enabled });

  return useQuery(options);
}
