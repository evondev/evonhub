import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchUsersByCourseId } from "../../actions";

interface GetUserByCourseProps {
  courseId: string;
  isGetAll?: boolean;
}

export function getUsersByCourseOptions({
  courseId,
  isGetAll,
}: GetUserByCourseProps) {
  return queryOptions({
    enabled: !!courseId || !!isGetAll,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchUsersByCourseId({ courseId, isGetAll });

      return response;
    },
    queryKey: [QUERY_KEYS.GET_USERS_BY_COURSE, courseId, isGetAll],
  });
}

export function useQueryUsersByCourse({
  courseId,
  isGetAll,
}: GetUserByCourseProps) {
  const options = getUsersByCourseOptions({ courseId, isGetAll });

  return useQuery(options);
}
