import { describe, expect, it } from "vitest";
import { ChatMessageItem, ChatMessageView } from "../types";
import {
  formatChatTime,
  getLatestConfirmedMessageId,
  getNextVietnamMidnight,
  getVietnamStartOfDay,
  hasProfanity,
  isContinuationMessage,
  mergeIncomingMessages,
  parseMessageSegments,
} from "./index";

function buildMessage(overrides: Partial<ChatMessageView>): ChatMessageView {
  return {
    _id: "message-1",
    clientId: "client-1",
    sender: {
      userId: "user-1",
      name: "An",
      username: "an",
      avatar: "",
    },
    content: "Xin chào",
    createdAt: "2026-10-06T03:00:00.000Z",
    ...overrides,
  };
}

describe("hasProfanity", () => {
  it.each([
    "dm",
    "DM nó",
    "đm",
    "đ.m",
    "d m m",
    "dmmmmm",
    "dcm thật",
    "v c l",
    "vcl luôn",
    "Địt",
    "lồnnnn",
    "lồn", // "lồn" gõ kiểu NFD trên macOS
    "đéo hiểu",
    "fuckkkk",
    "f.u.c.k",
    "d1t me",
    "dit con me",
    "óc chó",
  ])("chặn %s", (content) => {
    expect(hasProfanity(content)).toBe(true);
  });

  it.each([
    "đi học thôi",
    "cái lon nước ngọt",
    "lon bia",
    "đeo kính vào",
    "dù mà mệt vẫn học",
    "dài 10 cm",
    "trang admin",
    "ngã đau cả đít",
    "các con ơi",
    "https://evonhub.dev/dm",
    "",
  ])("không chặn %s", (content) => {
    expect(hasProfanity(content)).toBe(false);
  });
});

describe("chat date", () => {
  it("lấy 00:00 giờ Việt Nam dù đang là tối hôm trước theo UTC", () => {
    // 2026-10-06 01:30 giờ VN
    const now = new Date("2026-10-05T18:30:00.000Z");

    expect(getVietnamStartOfDay(now).toISOString()).toBe(
      "2026-10-05T17:00:00.000Z",
    );
    expect(getNextVietnamMidnight(now).toISOString()).toBe(
      "2026-10-06T17:00:00.000Z",
    );
  });

  it("đúng nửa đêm là sang ngày mới", () => {
    const midnight = new Date("2026-10-06T17:00:00.000Z");

    expect(getVietnamStartOfDay(midnight).toISOString()).toBe(
      "2026-10-06T17:00:00.000Z",
    );
  });

  it("hiện giờ phút theo giờ Việt Nam", () => {
    expect(formatChatTime("2026-10-06T02:05:00.000Z")).toBe("09:05");
  });
});

describe("parseMessageSegments", () => {
  it("tách link và bỏ dấu câu dính cuối", () => {
    expect(parseMessageSegments("xem https://evonhub.dev/chat.")).toEqual([
      { type: "text", value: "xem " },
      {
        type: "link",
        value: "https://evonhub.dev/chat",
        href: "https://evonhub.dev/chat",
      },
      { type: "text", value: "." },
    ]);
  });

  it("thêm https cho link bắt đầu bằng www", () => {
    expect(parseMessageSegments("www.google.com")).toEqual([
      { type: "link", value: "www.google.com", href: "https://www.google.com/" },
    ]);
  });

  it("không biến javascript: thành link", () => {
    expect(parseMessageSegments("javascript:alert(1)")).toEqual([
      { type: "text", value: "javascript:alert(1)" },
    ]);
  });

  it("giữ nguyên HTML dưới dạng chữ", () => {
    expect(parseMessageSegments("<b>hi</b>")).toEqual([
      { type: "text", value: "<b>hi</b>" },
    ]);
  });
});

describe("isContinuationMessage", () => {
  const firstMessage = buildMessage({});

  it("gộp tin cùng người trong 5 phút", () => {
    const nextMessage = buildMessage({
      createdAt: "2026-10-06T03:04:00.000Z",
    });

    expect(isContinuationMessage(firstMessage, nextMessage)).toBe(true);
  });

  it("không gộp khi khác người hoặc cách quá 5 phút", () => {
    const otherSender = buildMessage({
      sender: { ...firstMessage.sender, userId: "user-2" },
    });
    const lateMessage = buildMessage({ createdAt: "2026-10-06T03:06:00.000Z" });

    expect(isContinuationMessage(firstMessage, otherSender)).toBe(false);
    expect(isContinuationMessage(firstMessage, lateMessage)).toBe(false);
    expect(isContinuationMessage(undefined, firstMessage)).toBe(false);
  });
});

describe("mergeIncomingMessages", () => {
  it("thay tin đang gửi bằng tin server trả về, không nhân đôi", () => {
    const pendingMessage = buildMessage({ _id: "", isPending: true });
    const confirmedMessage: ChatMessageItem = buildMessage({ _id: "server-1" });

    const mergedMessages = mergeIncomingMessages(
      [pendingMessage],
      [confirmedMessage],
    );

    expect(mergedMessages).toEqual([confirmedMessage]);
  });

  it("thêm tin mới xuống cuối và bỏ qua tin trùng trong cùng lô", () => {
    const existingMessage = buildMessage({});
    const newMessage = buildMessage({ _id: "message-2", clientId: "client-2" });

    const mergedMessages = mergeIncomingMessages(
      [existingMessage],
      [newMessage, newMessage],
    );

    expect(mergedMessages.map((message) => message._id)).toEqual([
      "message-1",
      "message-2",
    ]);
  });
});

describe("getLatestConfirmedMessageId", () => {
  it("bỏ qua tin đang gửi ở cuối", () => {
    const messages = [
      buildMessage({ _id: "message-1" }),
      buildMessage({ _id: "", clientId: "client-2", isPending: true }),
    ];

    expect(getLatestConfirmedMessageId(messages)).toBe("message-1");
    expect(getLatestConfirmedMessageId([])).toBeUndefined();
  });
});
