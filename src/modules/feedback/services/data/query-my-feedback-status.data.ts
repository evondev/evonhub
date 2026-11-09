import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchMyFeedbackStatus } from "../../actions";

interface GetMyFeedbackStatusOptionsProps {
  /** Chỉ để tách cache theo người, server tự đọc user từ session */
  userId: string;
}

export function getMyFeedbackStatusOptions({
  userId,
}: GetMyFeedbackStatusOptionsProps) {
  return queryOptions({
    enabled: Boolean(userId),
    // Chỉ đổi khi chính người này gửi, lúc đó tự ghi cache
    staleTime: Infinity,
    queryFn: () => fetchMyFeedbackStatus(),
    queryKey: [QUERY_KEYS.GET_MY_FEEDBACK_STATUS, userId],
  });
}

export function useQueryMyFeedbackStatus(
  props: GetMyFeedbackStatusOptionsProps,
) {
  return useQuery(getMyFeedbackStatusOptions(props));
}
