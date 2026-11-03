"use client";

import { UserAvatar } from "@/shared/components/common/user-avatar";
import { buildPublicProfilePath } from "@/shared/helpers/url.helper";
import { cn } from "@/shared/utils";
import Link from "next/link";
import { memo, useMemo } from "react";
import { ChatMessageView } from "../../../types";
import {
  formatChatTime,
  getViewerReaction,
  parseMessageSegments,
  summarizeChatReactions,
} from "../../../utils";
import { ChatMessageContent } from "./chat-message-content";
import { ChatMessageMenu } from "./chat-message-menu";
import { ChatMessageReactions } from "./chat-message-reactions";
import { ChatRoleBadge } from "./chat-role-badge";

interface ChatMessageItemProps {
  message: ChatMessageView;
  /** Tin đầu của một chuỗi cùng người: hiện tên */
  isFirstInGroup: boolean;
  /** Tin cuối của chuỗi: hiện avatar và giờ */
  isLastInGroup: boolean;
  isOwnMessage: boolean;
  viewerId: string;
  /** Admin/Expert: xoá được tin của người khác */
  canModerate: boolean;
  onDelete: (messageId: string, isOwnMessage: boolean) => void;
  onReact: (messageId: string, emoji: string) => void;
}

/**
 * Một bong bóng tin. Tin mình bên phải nền gradient theo vị trí trên màn hình
 * (`.chat-own-bubble` trong globals.scss), không tên, không avatar;
 * tin người khác bên trái, tên trên tin đầu chuỗi, avatar cạnh tin cuối chuỗi.
 * Bấm tên hoặc avatar mở trang công khai của người gửi. Reaction hiện thành
 * chip dưới bong bóng.
 * Khoảng cách là padding vì Virtuoso đo chiều cao từng item.
 */
function ChatMessageItemBase({
  message,
  isFirstInGroup,
  isLastInGroup,
  isOwnMessage,
  viewerId,
  canModerate,
  onDelete,
  onReact,
}: ChatMessageItemProps) {
  const segments = useMemo(
    () => parseMessageSegments(message.content),
    [message.content],
  );
  const senderName = message.sender.name || message.sender.username;
  const profilePath = buildPublicProfilePath(message.sender.username);
  const reactionSummaries = useMemo(
    () => summarizeChatReactions(message.reactions, viewerId),
    [message.reactions, viewerId],
  );
  const viewerReaction = getViewerReaction(message.reactions, viewerId);
  const canDelete = isOwnMessage || canModerate;

  function handleDelete() {
    onDelete(message._id, isOwnMessage);
  }

  function handleReact(emoji: string) {
    onReact(message._id, emoji);
  }

  // Tin đang gửi chưa có _id trên server nên chưa thả reaction hay xoá được
  const menu = !message.isPending && (
    <ChatMessageMenu
      ariaLabel={
        isOwnMessage
          ? "Thao tác với tin của bạn"
          : `Thao tác với tin của ${senderName}`
      }
      align={isOwnMessage ? "end" : "start"}
      viewerReaction={viewerReaction}
      canDelete={canDelete}
      onReact={handleReact}
      onDelete={handleDelete}
    />
  );
  const reactionChips = (
    <ChatMessageReactions
      summaries={reactionSummaries}
      isOwnMessage={isOwnMessage}
      onReact={handleReact}
    />
  );

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
            {menu}
            <p className="w-fit min-w-0 max-w-full whitespace-pre-wrap chat-own-bubble rounded-2xl px-3.5 py-2 text-[15px] leading-6 text-primary-foreground [overflow-wrap:anywhere]">
              <ChatMessageContent segments={segments} isOnPrimary />
            </p>
          </div>
          {reactionChips}
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
          <Link
            href={profilePath}
            aria-label={`Xem trang của ${senderName}`}
            className="block rounded-full transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <UserAvatar
              name={message.sender.name}
              avatar={message.sender.avatar}
            />
          </Link>
        )}
      </div>
      <div className="min-w-0 max-w-[80%] sm:max-w-[70%]">
        {isFirstInGroup && (
          <div className="mb-1 flex min-w-0 items-center gap-1.5 px-1">
            <Link
              href={profilePath}
              className="min-w-0 truncate rounded text-xs font-medium text-muted hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {senderName}
            </Link>
            <ChatRoleBadge role={message.sender.role} />
          </div>
        )}
        <div className="flex items-center gap-1">
          <p className="w-fit min-w-0 max-w-full whitespace-pre-wrap rounded-2xl bg-background px-3.5 py-2 text-[15px] leading-6 text-foreground [overflow-wrap:anywhere] dark:bg-white/[0.06]">
            <ChatMessageContent segments={segments} isOnPrimary={false} />
          </p>
          {menu}
        </div>
        {reactionChips}
        {timeLine}
      </div>
    </div>
  );
}

/** Tin không đổi thì không render lại khi danh sách nhận tin mới */
export const ChatMessageItem = memo(ChatMessageItemBase);
