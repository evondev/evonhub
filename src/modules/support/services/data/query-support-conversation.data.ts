import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { invalidateQueriesByKeys } from "@/shared/helpers/query-helper";
import { IS_PUSHER_CONFIGURED } from "@/shared/libs/pusher/client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchSupportConversation } from "../../actions";
import { SUPPORT_POLL_INTERVAL_MS } from "../../constants";

export function getSupportConversationOptions(conversationId: string) {
  return queryOptions({
    enabled: Boolean(conversationId),
    queryKey: [QUERY_KEYS.GET_SUPPORT_CONVERSATION, conversationId],
    queryFn: async () => {
      const thread = await fetchSupportConversation(conversationId);

      // Mở hội thoại là đánh dấu đã đọc: hộp thư phải bỏ chấm chưa đọc
      invalidateQueriesByKeys(QUERY_KEYS.GET_SUPPORT_INBOX);

      return thread;
    },
    refetchInterval: IS_PUSHER_CONFIGURED ? false : SUPPORT_POLL_INTERVAL_MS,
  });
}

export function useQuerySupportConversation(conversationId: string) {
  return useQuery(getSupportConversationOptions(conversationId));
}
