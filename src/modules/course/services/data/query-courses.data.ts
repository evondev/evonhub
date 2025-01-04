import { CourseStatus } from "@/shared/constants/course.constants";
import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchCourses } from "../../actions";

interface GetCoursesProps {
  status: CourseStatus;
}

export function getCoursesOptions({ status }: GetCoursesProps) {
  return queryOptions({
    enabled: !!status,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchCourses({ status });

      return response;
    },
    queryKey: [QUERY_KEYS.GET_COURSES, status],
  });
}

export function useQueryCourses({ status }: GetCoursesProps) {
  const options = getCoursesOptions({ status });

  return useQuery(options);
}
