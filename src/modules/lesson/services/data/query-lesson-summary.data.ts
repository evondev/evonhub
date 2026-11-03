import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { useQuery } from "@tanstack/react-query";
import { fetchLessonSummary } from "../../actions";

interface UseQueryLessonSummaryProps {
  lessonId: string;
  enabled?: boolean;
}

// Tên bài hầu như không đổi trong một phiên học
const LESSON_SUMMARY_STALE_MS = 10 * 60 * 1000;

export function useQueryLessonSummary({
  lessonId,
  enabled = true,
}: UseQueryLessonSummaryProps) {
  return useQuery({
    enabled: enabled && !!lessonId,
    queryFn: () => fetchLessonSummary(lessonId),
    queryKey: [QUERY_KEYS.GET_LESSON_SUMMARY, lessonId],
    staleTime: LESSON_SUMMARY_STALE_MS,
  });
}
