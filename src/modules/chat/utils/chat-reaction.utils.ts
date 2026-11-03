import { CHAT_REACTION_EMOJI_SYMBOLS, chatReactionEmojis } from "../constants";
import { ChatMessageView, ChatReaction, ChatReactionSummary } from "../types";

export function isChatReactionEmoji(emoji: unknown): emoji is string {
  return (
    typeof emoji === "string" && CHAT_REACTION_EMOJI_SYMBOLS.includes(emoji)
  );
}

/** Emoji mình đang thả trên tin, null là chưa thả */
export function getViewerReaction(
  reactions: ChatReaction[] = [],
  viewerId: string,
): string | null {
  return (
    reactions.find((reaction) => reaction.userId === viewerId)?.emoji ?? null
  );
}

/**
 * Mỗi người một reaction: bỏ reaction cũ của người này rồi thêm emoji mới,
 * emoji null là gỡ. Server và client cùng làm phép này nên kết quả khớp nhau
 */
export function applyChatReaction(
  reactions: ChatReaction[] = [],
  userId: string,
  emoji: string | null,
): ChatReaction[] {
  const otherReactions = reactions.filter(
    (reaction) => reaction.userId !== userId,
  );

  if (!emoji) return otherReactions;

  return [...otherReactions, { userId, emoji }];
}

/** Bấm lại emoji đang thả thì gỡ, bấm emoji khác thì đổi sang emoji đó */
export function getNextViewerReaction(
  reactions: ChatReaction[] = [],
  viewerId: string,
  emoji: string,
): string | null {
  return getViewerReaction(reactions, viewerId) === emoji ? null : emoji;
}

/** Gom reaction thành chip theo thứ tự bộ cố định, bỏ emoji không ai thả */
export function summarizeChatReactions(
  reactions: ChatReaction[] = [],
  viewerId: string,
): ChatReactionSummary[] {
  return chatReactionEmojis
    .map((reactionEmoji) => {
      const matchedReactions = reactions.filter(
        (reaction) => reaction.emoji === reactionEmoji.symbol,
      );

      return {
        emoji: reactionEmoji.symbol,
        label: reactionEmoji.label,
        count: matchedReactions.length,
        hasViewerReacted: matchedReactions.some(
          (reaction) => reaction.userId === viewerId,
        ),
      };
    })
    .filter((summary) => summary.count > 0);
}

/** Nhãn đọc màn hình cho một chip: "Thích: 2 người", thêm gợi ý gỡ nếu mình đã thả */
export function describeReactionChip(summary: ChatReactionSummary): string {
  const countLabel = `${summary.label}: ${summary.count} người`;

  if (!summary.hasViewerReacted) return countLabel;

  return `${countLabel}, bấm để bỏ`;
}

/** Thay danh sách reaction của một tin, các tin khác giữ nguyên object để memo không render lại */
export function replaceMessageReactions(
  messages: ChatMessageView[],
  messageId: string,
  reactions: ChatReaction[],
): ChatMessageView[] {
  return messages.map((message) =>
    message._id === messageId ? { ...message, reactions } : message,
  );
}
