"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  deleteChatMessage,
  fetchChatMessages,
  sendChatMessage,
} from "../actions";
import {
  CHAT_DELETE_ERROR_MESSAGE,
  CHAT_FIRST_ITEM_INDEX,
  CHAT_SEND_ERROR_MESSAGE,
} from "../constants";
import {
  ChatFeedState,
  ChatMessageItem,
  ChatMessageView,
  UseChatMessagesParams,
} from "../types";
import {
  createClientId,
  getLatestConfirmedMessageId,
  mergeIncomingMessages,
} from "../utils";

const EMPTY_FEED: ChatFeedState = {
  messages: [],
  firstItemIndex: CHAT_FIRST_ITEM_INDEX,
  hasMore: false,
};

/**
 * Giữ danh sách tin của phòng chat: gửi lạc quan (hiện ngay, server trả về thì
 * thay), chèn trang tin cũ lên đầu, lấy bù tin bị lỡ, gỡ tin bị xoá.
 */
export function useChatMessages({
  viewer,
  initialMessages,
  initialHasMore,
}: UseChatMessagesParams) {
  const [feed, setFeed] = useState<ChatFeedState>({
    messages: initialMessages,
    firstItemIndex: CHAT_FIRST_ITEM_INDEX,
    hasMore: initialHasMore,
  });
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const feedRef = useRef(feed);
  // Ref chặn gọi chồng: Virtuoso có thể báo chạm đầu hai lần trước khi state kịp đổi
  const isLoadingOlderRef = useRef(false);
  const isSyncingRef = useRef(false);

  // Các hàm bất đồng bộ đọc feed mới nhất qua ref, không bị closure cũ
  useEffect(() => {
    feedRef.current = feed;
  }, [feed]);

  const receiveMessages = useCallback((messages: ChatMessageView[]) => {
    setFeed((currentFeed) => ({
      ...currentFeed,
      messages: mergeIncomingMessages(currentFeed.messages, messages),
    }));
  }, []);

  const receiveMessage = useCallback(
    (message: ChatMessageItem) => receiveMessages([message]),
    [receiveMessages],
  );

  const removeMessage = useCallback((messageId: string) => {
    setFeed((currentFeed) => ({
      ...currentFeed,
      messages: currentFeed.messages.filter(
        (message) => message._id !== messageId,
      ),
    }));
  }, []);

  const removePendingMessage = useCallback((clientId: string) => {
    setFeed((currentFeed) => ({
      ...currentFeed,
      messages: currentFeed.messages.filter(
        (message) => message.clientId !== clientId,
      ),
    }));
  }, []);

  const loadOlderMessages = useCallback(async () => {
    const currentFeed = feedRef.current;
    const oldestMessage = currentFeed.messages[0];

    if (!currentFeed.hasMore || !oldestMessage || isLoadingOlderRef.current) {
      return;
    }

    isLoadingOlderRef.current = true;
    setIsLoadingOlder(true);

    const olderPage = await fetchChatMessages({ before: oldestMessage._id });

    isLoadingOlderRef.current = false;
    setIsLoadingOlder(false);

    if (!olderPage) return;

    setFeed((latestFeed) => {
      const existingClientIds = new Set(
        latestFeed.messages.map((message) => message.clientId),
      );
      const olderMessages = olderPage.messages.filter(
        (message) => !existingClientIds.has(message.clientId),
      );

      return {
        messages: [...olderMessages, ...latestFeed.messages],
        firstItemIndex: latestFeed.firstItemIndex - olderMessages.length,
        hasMore: olderPage.hasMore,
      };
    });
  }, []);

  const syncMessages = useCallback(async () => {
    if (isSyncingRef.current) return;

    isSyncingRef.current = true;

    const latestMessageId = getLatestConfirmedMessageId(
      feedRef.current.messages,
    );
    const syncedPage = await fetchChatMessages(
      latestMessageId ? { after: latestMessageId } : {},
    );

    isSyncingRef.current = false;

    if (syncedPage) receiveMessages(syncedPage.messages);
  }, [receiveMessages]);

  /** Trả về lỗi để ô nhập báo và giữ lại nội dung, null là đã gửi */
  const sendMessage = useCallback(
    async (content: string): Promise<string | null> => {
      const clientId = createClientId();
      const pendingMessage: ChatMessageView = {
        _id: "",
        clientId,
        sender: {
          userId: viewer.userId,
          name: viewer.name,
          username: viewer.username,
          avatar: viewer.avatar,
          role: viewer.role,
        },
        content: content.trim(),
        createdAt: new Date().toISOString(),
        isPending: true,
      };

      receiveMessages([pendingMessage]);

      const result = await sendChatMessage({ clientId, content });

      if (result.message) {
        receiveMessage(result.message);
        return null;
      }

      removePendingMessage(clientId);

      return result.error || CHAT_SEND_ERROR_MESSAGE;
    },
    [viewer, receiveMessages, receiveMessage, removePendingMessage],
  );

  /**
   * Gỡ tin ngay trên màn rồi mới gọi server. Server từ chối thì trả tin về đúng
   * chỗ cũ và trả về lỗi
   */
  const deleteMessage = useCallback(
    async (messageId: string): Promise<string | null> => {
      const currentMessages = feedRef.current.messages;
      const deletedIndex = currentMessages.findIndex(
        (message) => message._id === messageId,
      );
      const deletedMessage = currentMessages[deletedIndex];

      removeMessage(messageId);

      const result = await deleteChatMessage(messageId);

      if (result.isDeleted) return null;

      if (deletedMessage) {
        setFeed((latestFeed) => {
          const restoredMessages = [...latestFeed.messages];

          restoredMessages.splice(deletedIndex, 0, deletedMessage);

          return { ...latestFeed, messages: restoredMessages };
        });
      }

      return result.error || CHAT_DELETE_ERROR_MESSAGE;
    },
    [removeMessage],
  );

  /** Sang ngày mới: tin hôm qua đã hết hạn trên server */
  const clearMessages = useCallback(() => setFeed(EMPTY_FEED), []);

  return {
    ...feed,
    isLoadingOlder,
    receiveMessage,
    removeMessage,
    loadOlderMessages,
    syncMessages,
    sendMessage,
    deleteMessage,
    clearMessages,
  };
}
