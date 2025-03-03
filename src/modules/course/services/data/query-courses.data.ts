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
  isUpdateViews?: boolean;
}

export function getCoursesOptions({
  status,
  isUpdateViews = true,
}: GetCoursesProps) {
  return queryOptions({
    enabled: !!status,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchCourses({ status, isUpdateViews });

      return response;
    },
    queryKey: [QUERY_KEYS.GET_COURSES, status],
  });
}

export function useQueryCourses({ status, isUpdateViews }: GetCoursesProps) {
  const options = getCoursesOptions({ status, isUpdateViews });

  return useQuery(options);
}
