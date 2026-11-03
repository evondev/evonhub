import { describe, expect, it } from "vitest";
import {
  describeChatActivity,
  getTodayLastMessageTime,
  hasUnreadChat,
  isChatLively,
} from "./chat-activity.utils";

// 10:00 ngày 03/11/2026 giờ VN
const NOW = new Date("2026-11-03T03:00:00.000Z").getTime();
const MINUTE_MS = 60_000;

describe("getTodayLastMessageTime", () => {
  it("bỏ tin của hôm qua vì đã bị xoá lúc 00:00", () => {
    // 23:50 ngày 02/11 giờ VN
    const yesterdayMessageAt = "2026-11-02T16:50:00.000Z";

    expect(getTodayLastMessageTime(yesterdayMessageAt, NOW)).toBeNull();
    expect(getTodayLastMessageTime(null, NOW)).toBeNull();
  });

  it("giữ tin của hôm nay", () => {
    // 00:05 ngày 03/11 giờ VN
    const todayMessageAt = "2026-11-02T17:05:00.000Z";

    expect(getTodayLastMessageTime(todayMessageAt, NOW)).toBe(
      new Date(todayMessageAt).getTime(),
    );
  });
});

describe("hasUnreadChat", () => {
  it("chưa từng vào phòng thì tin hôm nay là tin mới", () => {
    expect(hasUnreadChat(NOW, null)).toBe(true);
  });

  it("chỉ báo tin mới khi tin đến sau lần xem cuối", () => {
    expect(hasUnreadChat(NOW, NOW - MINUTE_MS)).toBe(true);
    expect(hasUnreadChat(NOW - MINUTE_MS, NOW)).toBe(false);
  });

  it("hôm nay chưa ai nhắn thì không có gì mới", () => {
    expect(hasUnreadChat(null, null)).toBe(false);
  });
});

describe("isChatLively", () => {
  it("sôi nổi khi tin gần nhất chưa quá 5 phút", () => {
    expect(isChatLively(NOW - 4 * MINUTE_MS, NOW)).toBe(true);
    expect(isChatLively(NOW - 5 * MINUTE_MS, NOW)).toBe(false);
    expect(isChatLively(null, NOW)).toBe(false);
  });
});

describe("describeChatActivity", () => {
  it("nói số người trong phòng và tin vừa đến", () => {
    const description = describeChatActivity(12, NOW - 10_000, NOW);

    expect(description).toBe("12 người trong phòng · tin mới vừa xong");
  });

  it("tin cũ hơn thì nói phút, giờ", () => {
    const emptyRoomCount = 0;

    expect(describeChatActivity(emptyRoomCount, NOW - 5 * MINUTE_MS, NOW)).toBe(
      "tin mới 5 phút trước",
    );
    expect(
      describeChatActivity(emptyRoomCount, NOW - 125 * MINUTE_MS, NOW),
    ).toBe("tin mới 2 giờ trước");
  });

  it("phòng trống, không có tin thì rỗng", () => {
    expect(describeChatActivity(0, null, NOW)).toBe("");
  });
});
