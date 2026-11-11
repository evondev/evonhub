import { describe, expect, it } from "vitest";
import {
  SUPPORT_EMPTY_MESSAGE,
  SUPPORT_PREVIEW_MAX_LENGTH,
  SUPPORT_UNANSWERED_LIMIT,
} from "../constants";
import { SupportMessageItem, SupportUserSummary } from "../types";
import {
  appendSupportMessage,
  getSupportContentError,
  getSupportUserLockLabel,
  isSupportLimitReached,
  toSupportPreview,
} from "./support-message.utils";

const message: SupportMessageItem = {
  id: "m1",
  isFromAdmin: false,
  content: "Chào admin",
  createdAt: "2026-11-11T03:00:00.000Z",
};

const user: SupportUserSummary = {
  id: "u1",
  name: "Lan",
  username: "lan",
  email: "lan@example.com",
  avatar: "",
  isLocked: false,
  lockedUntil: null,
};

describe("getSupportContentError", () => {
  it("chỉ có khoảng trắng là rỗng", () => {
    expect(getSupportContentError("   ")).toBe(SUPPORT_EMPTY_MESSAGE);
  });

  it("tin bình thường gửi được", () => {
    expect(getSupportContentError("Em chưa vào được khoá học")).toBeNull();
  });
});

describe("isSupportLimitReached", () => {
  it("chạm giới hạn thì khoá", () => {
    expect(isSupportLimitReached(SUPPORT_UNANSWERED_LIMIT - 1)).toBe(false);
    expect(isSupportLimitReached(SUPPORT_UNANSWERED_LIMIT)).toBe(true);
  });
});

describe("toSupportPreview", () => {
  it("gộp xuống dòng thành một dòng", () => {
    expect(toSupportPreview("Dòng 1\n\nDòng 2")).toBe("Dòng 1 Dòng 2");
  });

  it("cắt tin dài, không vượt độ dài tối đa", () => {
    const preview = toSupportPreview("a".repeat(500));

    expect(preview).toHaveLength(SUPPORT_PREVIEW_MAX_LENGTH);
    expect(preview.endsWith("…")).toBe(true);
  });
});

describe("appendSupportMessage", () => {
  it("không nối trùng tin đã có", () => {
    expect(appendSupportMessage([message], message)).toEqual([message]);
  });

  it("nối tin mới vào cuối", () => {
    const nextMessage = { ...message, id: "m2" };

    expect(appendSupportMessage([message], nextMessage)).toEqual([
      message,
      nextMessage,
    ]);
  });
});

describe("getSupportUserLockLabel", () => {
  it("không bị khoá thì không có nhãn", () => {
    expect(getSupportUserLockLabel(user)).toBeNull();
  });

  it("khoá không hạn ghi vĩnh viễn", () => {
    expect(getSupportUserLockLabel({ ...user, isLocked: true })).toBe(
      "Bị khoá vĩnh viễn",
    );
  });
});
