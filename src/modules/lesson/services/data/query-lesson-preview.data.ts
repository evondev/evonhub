import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { getLessonPreview } from "../../actions";

interface GetLessonPreviewProps {
  lessonId: string;
  enabled?: boolean;
}

export function getLessonPreviewOptions({
  lessonId,
  enabled,
}: GetLessonPreviewProps) {
  return queryOptions({
    enabled,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await getLessonPreview(lessonId);

      return response;
    },
    queryKey: [QUERY_KEYS.GET_LESSON_PREVIEW, lessonId],
  });
}

export function useQueryLessonPreview({
  lessonId,
  enabled,
}: GetLessonPreviewProps) {
  const options = getLessonPreviewOptions({ lessonId, enabled });

  return useQuery(options);
}
