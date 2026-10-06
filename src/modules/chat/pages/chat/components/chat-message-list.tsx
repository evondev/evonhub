"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { ChatMessageListContext, ChatMessageView } from "../../../types";
import { isContinuationMessage } from "../../../utils";
import { ChatMessageItem } from "./chat-message-item";
import { ChatMessageListFooter } from "./chat-message-list-footer";
import { ChatMessageListHeader } from "./chat-message-list-header";
import { ChatNewMessagesButton } from "./chat-new-messages-button";

/** Cách đáy dưới mức này vẫn tính là đang ở cuối, tin mới thì tự kéo xuống */
const AT_BOTTOM_THRESHOLD_PX = 80;

// Khai báo ngoài component: Virtuoso dựng lại toàn bộ khi object này đổi
const listComponents = {
  Header: ChatMessageListHeader,
  Footer: ChatMessageListFooter,
};

interface ChatMessageListProps {
  messages: ChatMessageView[];
  firstItemIndex: number;
  hasMore: boolean;
  isLoadingOlder: boolean;
  viewerId: string;
  canModerate: boolean;
  onLoadOlder: () => void;
  onDeleteMessage: (messageId: string, isOwnMessage: boolean) => void;
}

/**
 * Danh sách ảo: chỉ dựng DOM cho các tin đang thấy. Chạm đầu thì tải trang
 * cũ hơn và chèn lên mà không nhảy vị trí; đang ở cuối thì bám theo tin mới.
 */
export function ChatMessageList({
  messages,
  firstItemIndex,
  hasMore,
  isLoadingOlder,
  viewerId,
  canModerate,
  onLoadOlder,
  onDeleteMessage,
}: ChatMessageListProps) {
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const lastClientIdRef = useRef(messages[messages.length - 1]?.clientId);
  const listContext = useMemo<ChatMessageListContext>(
    () => ({ hasMore, isLoadingOlder }),
    [hasMore, isLoadingOlder],
  );

  const scrollToBottom = useCallback(() => {
    virtuosoRef.current?.scrollToIndex({
      index: "LAST",
      align: "end",
      behavior: "smooth",
    });
    setUnreadCount(0);
  }, []);

  function handleAtBottomStateChange(isBottomReached: boolean) {
    setIsAtBottom(isBottomReached);

    if (isBottomReached) setUnreadCount(0);
  }

  function handleStartReached() {
    if (hasMore) onLoadOlder();
  }

  // Chỉ xét khi tin cuối đổi: tin mình gửi thì luôn kéo xuống, tin người khác
  // tới lúc đang đọc tin cũ thì đếm để hiện nút "N tin mới"
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (!lastMessage || lastMessage.clientId === lastClientIdRef.current) {
      return;
    }

    lastClientIdRef.current = lastMessage.clientId;

    if (lastMessage.sender.userId === viewerId) {
      scrollToBottom();
      return;
    }

    if (!isAtBottom) setUnreadCount((currentCount) => currentCount + 1);
  }, [messages, viewerId, isAtBottom, scrollToBottom]);

  // Phòng chưa có tin: để trống, câu mở lời nằm ngay trên ô soạn tin
  if (messages.length === 0) return <div className="min-h-0 flex-1" />;

  return (
    <div className="relative min-h-0 flex-1">
      <Virtuoso
        ref={virtuosoRef}
        className="h-full"
        data={messages}
        context={listContext}
        components={listComponents}
        firstItemIndex={firstItemIndex}
        initialTopMostItemIndex={{
          index: Math.max(messages.length - 1, 0),
          align: "end",
        }}
        alignToBottom
        atBottomThreshold={AT_BOTTOM_THRESHOLD_PX}
        followOutput={(isBottomReached) =>
          isBottomReached ? "smooth" : false
        }
        atBottomStateChange={handleAtBottomStateChange}
        startReached={handleStartReached}
        computeItemKey={(_, message) => message.clientId}
        itemContent={(index, message) => {
          const position = index - firstItemIndex;

          return (
            <ChatMessageItem
              message={message}
              isFirstInGroup={
                !isContinuationMessage(messages[position - 1], message)
              }
              isLastInGroup={
                !messages[position + 1] ||
                !isContinuationMessage(message, messages[position + 1])
              }
              isOwnMessage={message.sender.userId === viewerId}
              canModerate={canModerate}
              onDelete={onDeleteMessage}
            />
          );
        }}
      />
      {unreadCount > 0 && (
        <ChatNewMessagesButton count={unreadCount} onClick={scrollToBottom} />
      )}
    </div>
  );
}
