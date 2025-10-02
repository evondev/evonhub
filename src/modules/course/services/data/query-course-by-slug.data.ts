import { CourseStatus } from "@/shared/constants/course.constants";
import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchCourseBySlug } from "../../actions";

interface GetCourseBySlugProps {
  courseSlug: string;
  status?: CourseStatus;
}

export function getCourseBySlugOptions({
  courseSlug,
  status,
}: GetCourseBySlugProps) {
  return queryOptions({
    enabled: !!courseSlug,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchCourseBySlug(courseSlug, status);

      return response;
    },
    queryKey: [QUERY_KEYS.GET_COURSE_BY_SLUG, courseSlug, status],
  });
}

export function useQueryCourseBySlug({
  courseSlug,
  status,
}: GetCourseBySlugProps) {
  const options = getCourseBySlugOptions({ courseSlug, status });

  return useQuery(options);
}
