import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchUserCourses } from "../../actions";

interface GetUserCoursesProps {
  userId: string;
  courseOnly?: boolean;
}

export function getUserCoursesOptions({
  userId,
  courseOnly,
}: GetUserCoursesProps) {
  return queryOptions({
    enabled: !!userId,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchUserCourses({ userId, courseOnly });

      return response;
    },
    queryKey: [QUERY_KEYS.GET_USER_COURSES, userId, courseOnly],
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useQueryUserCourses({
  userId,
  courseOnly,
}: GetUserCoursesProps) {
  const options = getUserCoursesOptions({ userId, courseOnly });

  return useQuery(options);
}
