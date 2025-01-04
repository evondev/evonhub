import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchCourseBySlug } from "../../actions";

interface GetCourseBySlugProps {
  courseSlug: string;
}

export function getCourseBySlugOptions({ courseSlug }: GetCourseBySlugProps) {
  return queryOptions({
    enabled: !!courseSlug,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchCourseBySlug(courseSlug);

      return response;
    },
    queryKey: [QUERY_KEYS.GET_COURSE_BY_SLUG],
  });
}

export function useQueryCourseBySlug({ courseSlug }: GetCourseBySlugProps) {
  const options = getCourseBySlugOptions({ courseSlug });

  return useQuery(options);
}
