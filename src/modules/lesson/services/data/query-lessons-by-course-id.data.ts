import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchLessonsByCourseId } from "../../actions";

interface GetLessonsByCourseIdProps {
  courseId: string;
  enabled?: boolean;
}

export function getLessonsByCourseIdOptions({
  courseId,
  enabled = false,
}: GetLessonsByCourseIdProps) {
  return queryOptions({
    enabled,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchLessonsByCourseId(courseId);

      return response;
    },
    queryKey: [QUERY_KEYS.GET_LESSONS_BY_COURSE_ID, courseId],
  });
}

export function useQueryLessonsByCourseId({
  courseId,
  enabled,
}: GetLessonsByCourseIdProps) {
  const options = getLessonsByCourseIdOptions({ courseId, enabled });

  return useQuery(options);
}
