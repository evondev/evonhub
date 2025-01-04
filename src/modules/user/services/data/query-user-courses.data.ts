import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchUserCourses } from "../../actions";

interface GetUserCoursesProps {
  userId: string;
}

export function getUserCoursesOptions({ userId }: GetUserCoursesProps) {
  return queryOptions({
    enabled: !!userId,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchUserCourses({ userId });

      return response;
    },
    queryKey: [QUERY_KEYS.GET_USER_COURSES, userId],
  });
}

export function useQueryUserCourses({ userId }: GetUserCoursesProps) {
  const options = getUserCoursesOptions({ userId });

  return useQuery(options);
}
