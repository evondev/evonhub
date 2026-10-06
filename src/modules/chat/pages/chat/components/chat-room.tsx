"use client";

import {
  useChatChannel,
  useChatMessages,
  useMidnightReset,
  useMinutesUntilMidnight,
} from "../../../hooks";
import { CHAT_FRAME_HEIGHT_CLASS_NAME } from "../../../constants";
import { ChatMessageItem, ChatViewer } from "../../../types";
import { ChatRoomView } from "./chat-room-view";

interface ChatRoomProps {
  viewer: ChatViewer;
  initialMessages: ChatMessageItem[];
  initialHasMore: boolean;
}

/** Phòng chat thật: nối danh sách tin, kênh Pusher và mốc nửa đêm vào khung */
export function ChatRoom({
  viewer,
  initialMessages,
  initialHasMore,
}: ChatRoomProps) {
  const {
    messages,
    firstItemIndex,
    hasMore,
    isLoadingOlder,
    receiveMessage,
    removeMessage,
    loadOlderMessages,
    syncMessages,
    sendMessage,
    deleteMessage,
    clearMessages,
  } = useChatMessages({ viewer, initialMessages, initialHasMore });
  const { onlineMembers, isRealtimeEnabled } = useChatChannel({
    onMessage: receiveMessage,
    onMessageDeleted: removeMessage,
    onSync: syncMessages,
  });
  const minutesLeft = useMinutesUntilMidnight();

  useMidnightReset(clearMessages);

  return (
    <ChatRoomView
      viewer={viewer}
      messages={messages}
      firstItemIndex={firstItemIndex}
      hasMore={hasMore}
      isLoadingOlder={isLoadingOlder}
      onlineMembers={onlineMembers}
      isRealtimeEnabled={isRealtimeEnabled}
      minutesLeft={minutesLeft}
      className={CHAT_FRAME_HEIGHT_CLASS_NAME}
      onLoadOlder={loadOlderMessages}
      onSend={sendMessage}
      onDeleteMessage={deleteMessage}
    />
  );
}
