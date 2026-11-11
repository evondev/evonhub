import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchLessonLearners } from "../../actions";
import { LESSON_LEARNERS_REFETCH_MS } from "../../constants";
import { FetchLessonLearnersParams } from "../../types";

interface GetLessonLearnersOptionsProps extends FetchLessonLearnersParams {
  enabled?: boolean;
}

export function getLessonLearnersOptions({
  enabled = true,
  ...params
}: GetLessonLearnersOptionsProps) {
  return queryOptions({
    enabled: enabled && !!params.lessonId && !!params.courseId,
    // Không giữ số của bài cũ khi chuyển bài: số đó sai với bài mới
    staleTime: 0,
    // Tab ẩn thì React Query tự dừng hỏi
    refetchInterval: LESSON_LEARNERS_REFETCH_MS,
    queryFn: () => fetchLessonLearners(params),
    queryKey: [
      QUERY_KEYS.GET_LESSON_LEARNERS,
      params.lessonId,
      params.courseId,
    ],
  });
}

/** Người khác đang học cùng bài, tự làm mới mỗi phút */
export function useQueryLessonLearners(props: GetLessonLearnersOptionsProps) {
  return useQuery(getLessonLearnersOptions(props));
}
