"use client";

import { useEffect, useRef } from "react";
import { SupportMessageItem } from "../types";
import { SupportMessageBubble } from "./support-message-bubble";

interface SupportMessageListProps {
  messages: SupportMessageItem[];
  /** Người xem là Admin: tin của Admin nằm bên phải */
  isAdminViewer: boolean;
  /** Hiện khi chưa có tin nào */
  emptyState: React.ReactNode;
}

/** Danh sách tin cuộn trong khung, có tin mới thì kéo xuống cuối */
export function SupportMessageList({
  messages,
  isAdminViewer,
  emptyState,
}: SupportMessageListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageId = messages.at(-1)?.id;

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) return;

    scrollContainer.scrollTop = scrollContainer.scrollHeight;
  }, [lastMessageId]);

  return (
    <div
      ref={scrollContainerRef}
      className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-4"
    >
      {messages.length === 0 && emptyState}
      {messages.length > 0 && (
        <ol aria-label="Tin nhắn" className="flex flex-col gap-3">
          {messages.map((message) => (
            <SupportMessageBubble
              key={message.id}
              message={message}
              isOwn={message.isFromAdmin === isAdminViewer}
            />
          ))}
        </ol>
      )}
    </div>
  );
}
