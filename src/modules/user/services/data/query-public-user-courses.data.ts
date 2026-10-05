import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchPublicUserCourses } from "../../actions";

interface GetPublicUserCoursesProps {
  username: string;
}

export function getPublicUserCoursesOptions({
  username,
}: GetPublicUserCoursesProps) {
  return queryOptions({
    enabled: !!username,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchPublicUserCourses({ username });

      return response;
    },
    queryKey: [QUERY_KEYS.GET_USER_COURSES, "public", username],
  });
}

export function useQueryPublicUserCourses({
  username,
}: GetPublicUserCoursesProps) {
  const options = getPublicUserCoursesOptions({ username });

  return useQuery(options);
}
