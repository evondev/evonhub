import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchUserCourseProgress } from "../../actions";

interface GetUserProgressProps {
  userId: string;
  courseId: string;
}

export function getUserProgressOptions({
  userId,
  courseId,
}: GetUserProgressProps) {
  return queryOptions({
    enabled: !!userId && !!courseId,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchUserCourseProgress({ userId, courseId });

      return response;
    },
    queryKey: [QUERY_KEYS.GET_USER_PROGRESS, userId, courseId],
  });
}

export function useQueryUserCourseProgress({
  userId,
  courseId,
}: GetUserProgressProps) {
  const options = getUserProgressOptions({ userId, courseId });

  return useQuery(options);
}
