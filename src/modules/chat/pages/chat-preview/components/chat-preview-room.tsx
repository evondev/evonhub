"use client";

import { useMemo } from "react";
import {
  CHAT_FIRST_ITEM_INDEX,
  CHAT_PREVIEW_BLOCKED_DRAFT,
  CHAT_PREVIEW_MINUTES_LEFT,
  CHAT_PROFANITY_MESSAGE,
} from "../../../constants";
import { usePreviewChat } from "../../../hooks";
import { ChatPreviewState } from "../../../types";
import { buildPreviewOnlineMembers, buildPreviewViewer } from "../../../utils";
// Import thẳng file: barrel components kéo theo ChatLoader chạy ở server
import { ChatRoomView } from "../../chat/components/chat-room-view";

interface ChatPreviewRoomProps {
  state: ChatPreviewState;
}

/** Phòng chat dữ liệu giả: cùng khung với trang thật, gửi và xoá bấm thử được */
export function ChatPreviewRoom({ state }: ChatPreviewRoomProps) {
  const viewer = useMemo(() => buildPreviewViewer(state), [state]);
  const onlineMembers = useMemo(() => buildPreviewOnlineMembers(), []);
  const { messages, sendMessage, deleteMessage } = usePreviewChat({
    state,
    viewer,
  });
  const isBlockedState = state === "chan";

  return (
    <ChatRoomView
      viewer={viewer}
      messages={messages}
      firstItemIndex={CHAT_FIRST_ITEM_INDEX}
      hasMore={false}
      isLoadingOlder={false}
      onlineMembers={state === "rong" ? onlineMembers.slice(0, 5) : onlineMembers}
      isRealtimeEnabled
      minutesLeft={CHAT_PREVIEW_MINUTES_LEFT}
      className="min-h-0 flex-1"
      composerInitialDraft={isBlockedState ? CHAT_PREVIEW_BLOCKED_DRAFT : ""}
      composerInitialError={isBlockedState ? CHAT_PROFANITY_MESSAGE : ""}
      onLoadOlder={() => undefined}
      onSend={sendMessage}
      onDeleteMessage={deleteMessage}
    />
  );
}
