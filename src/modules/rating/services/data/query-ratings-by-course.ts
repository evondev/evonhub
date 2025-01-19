import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchRatingsByCourse } from "../../actions";

interface GetRatingsByCourseProps {
  courseId: string;
}

export function getRatingsByCourseOptions({
  courseId,
}: GetRatingsByCourseProps) {
  return queryOptions({
    enabled: !!courseId,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchRatingsByCourse({ courseId });

      return response;
    },
    queryKey: [QUERY_KEYS.GET_RATINGS_BY_COURSE, courseId],
  });
}

export function useQueryRatingsByCourse({ courseId }: GetRatingsByCourseProps) {
  const options = getRatingsByCourseOptions({ courseId });

  return useQuery(options);
}
