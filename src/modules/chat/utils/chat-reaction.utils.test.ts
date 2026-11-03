import { describe, expect, it } from "vitest";
import { ChatReaction } from "../types";
import {
  applyChatReaction,
  getNextViewerReaction,
  isChatReactionEmoji,
  summarizeChatReactions,
} from "./chat-reaction.utils";

const reactions: ChatReaction[] = [
  { userId: "user-1", emoji: "👍" },
  { userId: "user-2", emoji: "🔥" },
  { userId: "user-3", emoji: "👍" },
];

describe("applyChatReaction", () => {
  it("thay reaction cũ của cùng người, mỗi người chỉ một", () => {
    expect(applyChatReaction(reactions, "user-1", "🔥")).toEqual([
      { userId: "user-2", emoji: "🔥" },
      { userId: "user-3", emoji: "👍" },
      { userId: "user-1", emoji: "🔥" },
    ]);
  });

  it("emoji null là gỡ reaction của người đó", () => {
    expect(applyChatReaction(reactions, "user-2", null)).toEqual([
      { userId: "user-1", emoji: "👍" },
      { userId: "user-3", emoji: "👍" },
    ]);
  });

  it("tin cũ chưa có reactions vẫn thả được", () => {
    expect(applyChatReaction(undefined, "user-1", "😂")).toEqual([
      { userId: "user-1", emoji: "😂" },
    ]);
  });
});

describe("getNextViewerReaction", () => {
  it("bấm lại emoji đang thả thì gỡ", () => {
    expect(getNextViewerReaction(reactions, "user-1", "👍")).toBeNull();
  });

  it("bấm emoji khác thì đổi sang emoji đó", () => {
    expect(getNextViewerReaction(reactions, "user-1", "😢")).toBe("😢");
  });
});

describe("summarizeChatReactions", () => {
  it("gom theo thứ tự bộ cố định, đánh dấu emoji mình đã thả", () => {
    expect(summarizeChatReactions(reactions, "user-2")).toEqual([
      { emoji: "👍", label: "Thích", count: 2, hasViewerReacted: false },
      { emoji: "🔥", label: "Đỉnh", count: 1, hasViewerReacted: true },
    ]);
  });
});

describe("isChatReactionEmoji", () => {
  it("chỉ nhận emoji trong bộ cố định", () => {
    expect(isChatReactionEmoji("❤️")).toBe(true);
    expect(isChatReactionEmoji("💩")).toBe(false);
    expect(isChatReactionEmoji(42)).toBe(false);
  });
});
