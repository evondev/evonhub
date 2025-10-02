import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchCommentsByLesson } from "../../actions";

interface GetCommentsByLessonProps {
  lessonId: string;
}

export function getCommentsByLessonOptions({
  lessonId,
}: GetCommentsByLessonProps) {
  return queryOptions({
    enabled: !!lessonId,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchCommentsByLesson(lessonId);

      return response;
    },
    queryKey: [QUERY_KEYS.GET_COMMENTS_BY_LESSON, lessonId],
  });
}

export function useQueryCommentsByLesson({
  lessonId,
}: GetCommentsByLessonProps) {
  const options = getCommentsByLessonOptions({ lessonId });

  return useQuery(options);
}
