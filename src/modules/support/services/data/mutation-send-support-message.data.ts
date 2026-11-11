import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMySupportMessage } from "../../actions";
import { MySupportThread } from "../../types";
import { appendSupportMessage } from "../../utils";
import { MY_SUPPORT_THREAD_QUERY_KEY } from "./query-my-support-thread.data";

/** Gửi xong thì nối tin vào khung luôn, không chờ tải lại cả hội thoại */
export function useMutationSendSupportMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMySupportMessage,
    mutationKey: [QUERY_KEYS.HANDLE_SEND_SUPPORT_MESSAGE],
    onSuccess: (result) => {
      queryClient.setQueryData<MySupportThread | undefined>(
        MY_SUPPORT_THREAD_QUERY_KEY,
        (currentThread) => {
          // Lỗi nội dung, gửi nhanh quá: khung giữ nguyên
          if (!currentThread || (!result.message && !result.isLimitReached)) {
            return currentThread;
          }

          return {
            messages: result.message
              ? appendSupportMessage(currentThread.messages, result.message)
              : currentThread.messages,
            isLimitReached: Boolean(result.isLimitReached),
          };
        },
      );
    },
  });
}
