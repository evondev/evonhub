"use client";

import { useMutationUpdateUserStatus } from "@/modules/user/services/data/mutation-update-user-status.data";
import { LoadErrorState } from "@/shared/components/common/load-error-state";
import { Spinner } from "@/shared/components/common/spinner";
import { UserLockDialog } from "@/shared/components/user-lock-dialog";
import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { UserStatus } from "@/shared/constants/user.constants";
import { invalidateQueriesByKeys } from "@/shared/helpers/query-helper";
import { UserLockInput, UserLockTarget } from "@/shared/types/user.types";
import { useState } from "react";
import { toast } from "react-toastify";
import { SupportComposer, SupportMessageList } from "../../../components";
import { SUPPORT_SEND_ERROR_MESSAGE } from "../../../constants";
import {
  useMutationReplySupportMessage,
  useQuerySupportConversation,
} from "../../../services/data";
import { SupportConversationHeader } from "./support-conversation-header";

interface SupportConversationPanelProps {
  conversationId: string;
  onBack: () => void;
}

const USER_STATUS_ERROR_MESSAGE = "Chưa đổi được trạng thái, thử lại sau nhé";

/** Khung chat phía Admin: đọc, trả lời (nếu muốn), khoá hoặc mở khoá người nhắn */
export function SupportConversationPanel({
  conversationId,
  onBack,
}: SupportConversationPanelProps) {
  const [userPendingLock, setUserPendingLock] = useState<UserLockTarget | null>(
    null,
  );
  const {
    data: thread,
    isPending,
    refetch,
  } = useQuerySupportConversation(conversationId);
  const { mutateAsync: replyAsync } = useMutationReplySupportMessage();
  const updateUserStatusMutation = useMutationUpdateUserStatus();
  const user = thread?.conversation.user;

  async function handleReply(content: string): Promise<string | null> {
    try {
      const result = await replyAsync({ conversationId, content });

      return result.error || null;
    } catch {
      return SUPPORT_SEND_ERROR_MESSAGE;
    }
  }

  /** Đổi trạng thái xong thì tải lại để đầu khung, hộp thư hiện đúng nhãn khoá */
  async function changeUserStatus(
    status: UserStatus,
    lock?: UserLockInput,
  ): Promise<boolean> {
    if (!user) return false;

    try {
      const result = await updateUserStatusMutation.mutateAsync({
        userId: user.id,
        status,
        lock,
      });

      if (!result.isSuccess) {
        toast.error(result.message || USER_STATUS_ERROR_MESSAGE);
        return false;
      }

      invalidateQueriesByKeys(
        QUERY_KEYS.GET_SUPPORT_CONVERSATION,
        QUERY_KEYS.GET_SUPPORT_INBOX,
      );

      return true;
    } catch {
      toast.error(USER_STATUS_ERROR_MESSAGE);
      return false;
    }
  }

  function handleLockRequest() {
    if (user) setUserPendingLock({ name: user.name, email: user.email });
  }

  async function handleConfirmLock(lock: UserLockInput) {
    const isLocked = await changeUserStatus(UserStatus.Inactive, lock);

    if (!isLocked) return;

    toast.success(`Đã khoá tài khoản ${user?.name}`);
    setUserPendingLock(null);
  }

  async function handleUnlock() {
    const isUnlocked = await changeUserStatus(UserStatus.Active);

    if (isUnlocked) toast.success(`Đã mở khoá tài khoản ${user?.name}`);
  }

  if (isPending) return <Spinner className="my-auto" />;

  if (!thread || !user) {
    return (
      <LoadErrorState
        title="Chưa tải được cuộc trò chuyện"
        onRetry={refetch}
        className="flex-1 border-0"
      />
    );
  }

  return (
    <>
      <SupportConversationHeader
        user={user}
        isUnlocking={updateUserStatusMutation.isPending && !userPendingLock}
        onBack={onBack}
        onLock={handleLockRequest}
        onUnlock={handleUnlock}
      />
      <SupportMessageList
        messages={thread.messages}
        isAdminViewer
        emptyState={null}
      />
      <SupportComposer placeholder="Trả lời…" onSend={handleReply} />
      <UserLockDialog
        user={userPendingLock}
        isLocking={updateUserStatusMutation.isPending}
        onConfirm={handleConfirmLock}
        onCancel={() => setUserPendingLock(null)}
      />
    </>
  );
}
