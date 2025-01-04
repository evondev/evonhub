import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { getLessonById } from "../../actions";

interface GetLessonByIdProps {
  lessonId: string;
}

export function getLessonByIdOptions({ lessonId }: GetLessonByIdProps) {
  return queryOptions({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await getLessonById(lessonId);

      return response;
    },
    queryKey: [QUERY_KEYS.GET_LESSON_BY_ID],
  });
}

export function useQueryLessonById({ lessonId }: GetLessonByIdProps) {
  const options = getLessonByIdOptions({ lessonId });

  return useQuery(options);
}
