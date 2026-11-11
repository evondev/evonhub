"use client";

import { useUserContext } from "@/components/user-context";
import { LoadErrorState } from "@/shared/components/common/load-error-state";
import { Spinner } from "@/shared/components/common/spinner";
import { cn } from "@/shared/utils";
import { useQueryClient } from "@tanstack/react-query";
import { SupportComposer, SupportMessageList } from "../../components";
import {
  SUPPORT_FRAME_HEIGHT_CLASS_NAME,
  SUPPORT_LIMIT_REACHED_MESSAGE,
  SUPPORT_SEND_ERROR_MESSAGE,
} from "../../constants";
import { useSupportChannel } from "../../hooks/use-support-channel";
import {
  MY_SUPPORT_THREAD_QUERY_KEY,
  useMutationSendSupportMessage,
  useQueryMySupportThread,
} from "../../services/data";
import { SupportEmptyThread, SupportPageHeader } from "./components";

/** Học viên nhắn riêng cho Admin */
export function SupportPage() {
  const { userInfo } = useUserContext();
  const queryClient = useQueryClient();
  const { data: thread, isPending, refetch } = useQueryMySupportThread();
  const { mutateAsync: sendMessageAsync } = useMutationSendSupportMessage();

  useSupportChannel(userInfo?._id ? String(userInfo._id) : "", () => {
    queryClient.invalidateQueries({ queryKey: MY_SUPPORT_THREAD_QUERY_KEY });
  });

  async function handleSend(content: string): Promise<string | null> {
    try {
      const result = await sendMessageAsync(content);

      return result.error || null;
    } catch {
      return SUPPORT_SEND_ERROR_MESSAGE;
    }
  }

  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-border bg-surface",
        SUPPORT_FRAME_HEIGHT_CLASS_NAME,
      )}
    >
      <SupportPageHeader />
      {isPending && <Spinner className="my-auto" />}
      {!isPending && !thread && (
        <LoadErrorState
          title="Chưa tải được tin nhắn"
          onRetry={refetch}
          className="flex-1 border-0"
        />
      )}
      {thread && (
        <>
          <SupportMessageList
            messages={thread.messages}
            isAdminViewer={false}
            emptyState={<SupportEmptyThread />}
          />
          <SupportComposer
            placeholder="Nhắn cho Admin…"
            disabledMessage={
              thread.isLimitReached ? SUPPORT_LIMIT_REACHED_MESSAGE : undefined
            }
            onSend={handleSend}
          />
        </>
      )}
    </section>
  );
}
