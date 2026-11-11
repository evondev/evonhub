import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { invalidateQueriesByKeys } from "@/shared/helpers/query-helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { replySupportMessage } from "../../actions";
import { SupportConversationThread } from "../../types";
import { appendSupportMessage } from "../../utils";

/** Trả lời xong thì nối tin vào khung luôn, hộp thư tải lại để lên đầu */
export function useMutationReplySupportMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: replySupportMessage,
    mutationKey: [QUERY_KEYS.HANDLE_REPLY_SUPPORT_MESSAGE],
    onSuccess: (result, params) => {
      const replyMessage = result.message;

      if (!replyMessage) return;

      queryClient.setQueryData<SupportConversationThread | undefined>(
        [QUERY_KEYS.GET_SUPPORT_CONVERSATION, params.conversationId],
        (currentThread) =>
          currentThread && {
            ...currentThread,
            messages: appendSupportMessage(
              currentThread.messages,
              replyMessage,
            ),
          },
      );
      invalidateQueriesByKeys(QUERY_KEYS.GET_SUPPORT_INBOX);
    },
  });
}
