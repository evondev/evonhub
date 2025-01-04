import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchLessonsByCourseId } from "../../actions";

interface GetLessonsByCourseIdProps {
  courseId: string;
}

export function getLessonsByCourseIdOptions({
  courseId,
}: GetLessonsByCourseIdProps) {
  return queryOptions({
    enabled: !!courseId,
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
}: GetLessonsByCourseIdProps) {
  const options = getLessonsByCourseIdOptions({ courseId });

  return useQuery(options);
}
