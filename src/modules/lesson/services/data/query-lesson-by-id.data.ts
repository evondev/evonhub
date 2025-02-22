import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { getLessonById } from "../../actions";

interface GetLessonByIdProps {
  lessonId: string;
  enabled?: boolean;
}

export function getLessonByIdOptions({
  lessonId,
  enabled = false,
}: GetLessonByIdProps) {
  return queryOptions({
    enabled,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await getLessonById(lessonId);

      return response;
    },
    queryKey: [QUERY_KEYS.GET_LESSON_BY_ID, lessonId],
  });
}

export function useQueryLessonById({ lessonId, enabled }: GetLessonByIdProps) {
  const options = getLessonByIdOptions({ lessonId, enabled });

  return useQuery(options);
}
