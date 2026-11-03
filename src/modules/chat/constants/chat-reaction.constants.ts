import { ChatEmoji } from "../types";

/** Bộ reaction cố định, xếp theo thứ tự hiện trong menu và trên chip */
export const chatReactionEmojis: ChatEmoji[] = [
  { symbol: "👍", label: "Thích" },
  { symbol: "❤️", label: "Yêu thích" },
  { symbol: "😂", label: "Hài" },
  { symbol: "😮", label: "Wow" },
  { symbol: "😢", label: "Buồn" },
  { symbol: "🔥", label: "Đỉnh" },
];

/** Server chỉ nhận emoji trong bộ này */
export const CHAT_REACTION_EMOJI_SYMBOLS: string[] = chatReactionEmojis.map(
  (reactionEmoji) => reactionEmoji.symbol,
);
