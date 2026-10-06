"use client";

import { ConfirmDialog } from "@/shared/components/common/confirm-dialog";
import { cn } from "@/shared/utils";
import { Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { ChatMessageView, ChatSender, ChatViewer } from "../../../types";
import { ChatComposer } from "./chat-composer";
import { ChatMessageList } from "./chat-message-list";
import { ChatRoomHeader } from "./chat-room-header";

interface ChatRoomViewProps {
  viewer: ChatViewer;
  messages: ChatMessageView[];
  firstItemIndex: number;
  hasMore: boolean;
  isLoadingOlder: boolean;
  onlineMembers: ChatSender[];
  isRealtimeEnabled: boolean;
  minutesLeft: number;
  /** Chiều cao khung, mặc định do trang đặt cho vừa viewport */
  className?: string;
  composerInitialDraft?: string;
  composerInitialError?: string;
  onLoadOlder: () => void;
  onSend: (content: string) => Promise<string | null>;
  /** Trả về lỗi nếu chưa xoá được */
  onDeleteMessage: (messageId: string) => Promise<string | null>;
}

/**
 * Khung phòng chat: đầu khung (online, hạn xoá), danh sách tin, ô soạn. Không
 * biết dữ liệu đến từ đâu, nên trang thật và trang xem trước dùng chung.
 * `data-chat-room` khoá cuộn của trang (globals.scss): chỉ danh sách tin cuộn.
 */
export function ChatRoomView({
  viewer,
  messages,
  firstItemIndex,
  hasMore,
  isLoadingOlder,
  onlineMembers,
  isRealtimeEnabled,
  minutesLeft,
  className,
  composerInitialDraft,
  composerInitialError,
  onLoadOlder,
  onSend,
  onDeleteMessage,
}: ChatRoomViewProps) {
  const [pendingDelete, setPendingDelete] = useState({
    messageId: "",
    isDeleting: false,
  });

  // Tin của mình xoá luôn; mod xoá tin người khác thì hỏi lại trước
  const handleDeleteMessage = useCallback(
    async (messageId: string, isOwnMessage: boolean) => {
      if (!isOwnMessage) {
        setPendingDelete({ messageId, isDeleting: false });
        return;
      }

      const deleteError = await onDeleteMessage(messageId);

      if (deleteError) toast.error(deleteError);
    },
    [onDeleteMessage],
  );

  function handleCancelDelete() {
    setPendingDelete({ messageId: "", isDeleting: false });
  }

  async function handleConfirmDelete() {
    setPendingDelete((currentDelete) => ({
      ...currentDelete,
      isDeleting: true,
    }));

    const deleteError = await onDeleteMessage(pendingDelete.messageId);

    if (deleteError) toast.error(deleteError);

    setPendingDelete({ messageId: "", isDeleting: false });
  }

  return (
    <div
      data-chat-room
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-border bg-surface",
        className,
      )}
    >
      <ChatRoomHeader
        onlineMembers={onlineMembers}
        isRealtimeEnabled={isRealtimeEnabled}
        minutesLeft={minutesLeft}
      />
      <ChatMessageList
        messages={messages}
        firstItemIndex={firstItemIndex}
        hasMore={hasMore}
        isLoadingOlder={isLoadingOlder}
        viewerId={viewer.userId}
        canModerate={viewer.isModerator}
        onLoadOlder={onLoadOlder}
        onDeleteMessage={handleDeleteMessage}
      />
      <ChatComposer
        isRoomEmpty={messages.length === 0}
        initialDraft={composerInitialDraft}
        initialError={composerInitialError}
        onSend={onSend}
      />
      <ConfirmDialog
        isOpen={Boolean(pendingDelete.messageId)}
        icon={Trash2}
        title="Xoá tin nhắn này?"
        description="Tin nhắn biến mất với mọi người đang xem và không khôi phục được."
        confirmLabel="Xoá tin"
        isConfirming={pendingDelete.isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
