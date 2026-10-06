"use client";

import { CommentAvatar } from "@/shared/features/comment/comment-avatar";
import { cn } from "@/shared/utils";
import { memo, useMemo } from "react";
import { ChatMessageView } from "../../../types";
import { formatChatTime, parseMessageSegments } from "../../../utils";
import { ChatMessageContent } from "./chat-message-content";
import { ChatMessageMenu } from "./chat-message-menu";
import { ChatRoleBadge } from "./chat-role-badge";

interface ChatMessageItemProps {
  message: ChatMessageView;
  /** Tin đầu của một chuỗi cùng người: hiện tên */
  isFirstInGroup: boolean;
  /** Tin cuối của chuỗi: hiện avatar và giờ */
  isLastInGroup: boolean;
  isOwnMessage: boolean;
  /** Admin/Expert: xoá được tin của người khác */
  canModerate: boolean;
  onDelete: (messageId: string, isOwnMessage: boolean) => void;
}

/**
 * Một bong bóng tin. Tin mình bên phải nền màu nhấn, không tên, không avatar;
 * tin người khác bên trái, tên trên tin đầu chuỗi, avatar cạnh tin cuối chuỗi.
 * Khoảng cách là padding vì Virtuoso đo chiều cao từng item.
 */
function ChatMessageItemBase({
  message,
  isFirstInGroup,
  isLastInGroup,
  isOwnMessage,
  canModerate,
  onDelete,
}: ChatMessageItemProps) {
  const segments = useMemo(
    () => parseMessageSegments(message.content),
    [message.content],
  );
  // Tin đang gửi chưa có _id trên server nên chưa xoá được
  const isDeletable = !message.isPending && (isOwnMessage || canModerate);

  function handleDelete() {
    onDelete(message._id, isOwnMessage);
  }

  const timeLine = isLastInGroup && (
    <time
      dateTime={message.createdAt}
      className={cn(
        "mt-1 block text-[11px] text-muted",
        isOwnMessage && "text-right",
      )}
    >
      {message.isPending ? "Đang gửi…" : formatChatTime(message.createdAt)}
    </time>
  );

  if (isOwnMessage) {
    return (
      <div
        className={cn(
          "group relative flex justify-end px-4 sm:px-5",
          isFirstInGroup && "pt-3",
          !isFirstInGroup && "pt-0.5",
        )}
      >
        <div className="max-w-[80%] sm:max-w-[70%]">
          <div className="flex items-center justify-end gap-1">
            {isDeletable && (
              <ChatMessageMenu
                ariaLabel="Thao tác với tin của bạn"
                align="end"
                onDelete={handleDelete}
              />
            )}
            <p className="w-fit min-w-0 max-w-full whitespace-pre-wrap rounded-2xl bg-primary px-3.5 py-2 text-[15px] leading-6 text-primary-foreground [overflow-wrap:anywhere]">
              <ChatMessageContent segments={segments} isOnPrimary />
            </p>
          </div>
          {timeLine}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative flex items-end gap-2 px-4 sm:px-5",
        isFirstInGroup && "pt-3",
        !isFirstInGroup && "pt-0.5",
      )}
    >
      <div className="w-8 shrink-0">
        {isLastInGroup && (
          <CommentAvatar
            name={message.sender.name}
            avatar={message.sender.avatar}
          />
        )}
      </div>
      <div className="min-w-0 max-w-[80%] sm:max-w-[70%]">
        {isFirstInGroup && (
          <div className="mb-1 flex min-w-0 items-center gap-1.5 px-1">
            <span className="min-w-0 truncate text-xs font-medium text-muted">
              {message.sender.name || message.sender.username}
            </span>
            <ChatRoleBadge role={message.sender.role} />
          </div>
        )}
        <div className="flex items-center gap-1">
          <p className="w-fit min-w-0 max-w-full whitespace-pre-wrap rounded-2xl bg-background px-3.5 py-2 text-[15px] leading-6 text-foreground [overflow-wrap:anywhere] dark:bg-white/[0.06]">
            <ChatMessageContent segments={segments} isOnPrimary={false} />
          </p>
          {isDeletable && (
            <ChatMessageMenu
              ariaLabel={`Thao tác với tin của ${message.sender.name}`}
              align="start"
              onDelete={handleDelete}
            />
          )}
        </div>
        {timeLine}
      </div>
    </div>
  );
}

/** Tin không đổi thì không render lại khi danh sách nhận tin mới */
export const ChatMessageItem = memo(ChatMessageItemBase);
