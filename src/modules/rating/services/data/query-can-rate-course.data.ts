import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { useQuery } from "@tanstack/react-query";
import { fetchCanRateCourse } from "../../actions";

interface UseQueryCanRateCourseProps {
  courseId: string;
  /** Chỉ để tách cache theo người dùng, server lấy user từ session */
  userId: string;
  enabled?: boolean;
}

export function useQueryCanRateCourse({
  courseId,
  userId,
  enabled = true,
}: UseQueryCanRateCourseProps) {
  return useQuery({
    enabled: enabled && !!courseId && !!userId,
    queryFn: () => fetchCanRateCourse({ courseId }),
    queryKey: [QUERY_KEYS.GET_CAN_RATE_COURSE, courseId, userId],
  });
}
