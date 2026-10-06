"use client";

import { useCallback, useEffect, useState } from "react";
import {
  chatPreviewMessageSeeds,
  chatPreviewSenders,
} from "../constants";
import { ChatMessageView, ChatPreviewState, ChatViewer } from "../types";
import { buildPreviewMessages, createClientId } from "../utils";

/** Nhịp tin giả đến ở trạng thái "Tin đến liên tục" */
const PREVIEW_INCOMING_INTERVAL_MS = 3500;

/** Trễ giả của server, để thấy tin "Đang gửi…" trước khi thành tin thật */
const PREVIEW_SEND_DELAY_MS = 600;

interface UsePreviewChatParams {
  state: ChatPreviewState;
  viewer: ChatViewer;
}

/**
 * Danh sách tin của trang xem trước, chạy hoàn toàn ở trình duyệt: gửi, xoá
 * bấm thử được; trạng thái "tin-moi" tự thêm tin người khác theo nhịp
 */
export function usePreviewChat({ state, viewer }: UsePreviewChatParams) {
  const [messages, setMessages] = useState<ChatMessageView[]>(() =>
    state === "rong" ? [] : buildPreviewMessages(),
  );

  useEffect(() => {
    if (state !== "tin-moi") return;

    const otherSeeds = chatPreviewMessageSeeds.filter(
      (seed) => seed.senderKey !== "me",
    );
    let seedIndex = 0;
    const incomingTimer = window.setInterval(() => {
      const seed = otherSeeds[seedIndex % otherSeeds.length];

      seedIndex += 1;
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          _id: createClientId(),
          clientId: createClientId(),
          sender: chatPreviewSenders[seed.senderKey],
          content: seed.content,
          createdAt: new Date().toISOString(),
        },
      ]);
    }, PREVIEW_INCOMING_INTERVAL_MS);

    return () => window.clearInterval(incomingTimer);
  }, [state]);

  const sendMessage = useCallback(
    async (content: string): Promise<string | null> => {
      const clientId = createClientId();

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          _id: "",
          clientId,
          sender: viewer,
          content: content.trim(),
          createdAt: new Date().toISOString(),
          isPending: true,
        },
      ]);

      await new Promise((resolve) => setTimeout(resolve, PREVIEW_SEND_DELAY_MS));

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.clientId === clientId
            ? { ...message, _id: createClientId(), isPending: false }
            : message,
        ),
      );

      return null;
    },
    [viewer],
  );

  const deleteMessage = useCallback(
    async (messageId: string): Promise<string | null> => {
      setMessages((currentMessages) =>
        currentMessages.filter((message) => message._id !== messageId),
      );

      return null;
    },
    [],
  );

  return { messages, sendMessage, deleteMessage };
}
