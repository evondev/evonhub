import { CourseStatus } from "@/shared/constants/course.constants";
import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchCourses } from "../../actions";
import { FetchCoursesParams } from "../../types";

interface GetCoursesProps extends FetchCoursesParams {
  status: CourseStatus;
  isUpdateViews?: boolean;
  shouldFilterEnrolled?: boolean;
}

export function getCoursesOptions(props: GetCoursesProps) {
  return queryOptions({
    enabled: !!props.status,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchCourses(props);

      return response;
    },
    queryKey: [QUERY_KEYS.GET_COURSES, props],
  });
}

export function useQueryCourses(props: GetCoursesProps) {
  const options = getCoursesOptions(props);

  return useQuery(options);
}
