import { describe, expect, it } from "vitest";
import {
  buildRecentStudyDayKeys,
  getCreditableSeconds,
  getLeaderboardPeriodHref,
  getLessonMaxBucketCount,
  getPeriodResetLabel,
  getPeriodStartDayKey,
  getStudyDayKey,
  parseLeaderboardPeriod,
  sanitizeBuckets,
  toStudyMinutes,
} from "./index";

// Thứ Năm 05/11/2026, 20:15 giờ Việt Nam
const thursdayEvening = new Date("2026-11-05T13:15:00.000Z");

describe("ngày học theo giờ Việt Nam", () => {
  it("23:30 giờ UTC đã là sáng hôm sau ở Việt Nam", () => {
    expect(getStudyDayKey(new Date("2026-11-04T23:30:00.000Z"))).toBe(
      "2026-11-05",
    );
  });

  it("tuần bắt đầu thứ Hai, tháng bắt đầu ngày 1", () => {
    expect(getPeriodStartDayKey("week", thursdayEvening)).toBe("2026-11-02");
    expect(getPeriodStartDayKey("month", thursdayEvening)).toBe("2026-11-01");
    expect(getPeriodStartDayKey("all", thursdayEvening)).toBeNull();
  });

  it("Chủ nhật vẫn thuộc tuần bắt đầu từ thứ Hai trước đó", () => {
    const sundayNight = new Date("2026-11-08T16:00:00.000Z");

    expect(getPeriodStartDayKey("week", sundayNight)).toBe("2026-11-02");
  });

  it("nói còn bao lâu tới lúc bảng tính lại", () => {
    expect(getPeriodResetLabel("week", thursdayEvening)).toBe(
      "Bảng tuần tính lại lúc 0:00 thứ Hai, còn 3 ngày 3 giờ",
    );
    expect(getPeriodResetLabel("month", thursdayEvening)).toBe(
      "Bảng tháng 11 tính lại lúc 0:00 ngày 1/12, còn 25 ngày 3 giờ",
    );
  });

  it("tháng 12 tính lại vào ngày 1/1", () => {
    const december = new Date("2026-12-31T10:00:00.000Z");

    expect(getPeriodResetLabel("month", december)).toContain("ngày 1/1,");
  });

  it("7 ngày gần nhất, cũ trước, hôm nay cuối", () => {
    const studyDays = buildRecentStudyDayKeys(7, thursdayEvening);

    expect(studyDays.map((studyDay) => studyDay.label)).toEqual([
      "T6",
      "T7",
      "CN",
      "T2",
      "T3",
      "T4",
      "Hôm nay",
    ]);
    expect(studyDays[0].key).toBe("2026-10-30");
    expect(studyDays[6]).toMatchObject({ key: "2026-11-05", isToday: true });
  });
});

describe("kỳ trên URL", () => {
  it("kỳ lạ hoặc thiếu thì về bảng tuần", () => {
    expect(parseLeaderboardPeriod("month")).toBe("month");
    expect(parseLeaderboardPeriod("year")).toBe("week");
    expect(parseLeaderboardPeriod(undefined)).toBe("week");
  });

  it("bảng tuần không cần ?period=", () => {
    expect(getLeaderboardPeriodHref("week")).toBe("/leaderboard");
    expect(getLeaderboardPeriodHref("all")).toBe("/leaderboard?period=all");
  });
});

describe("ô xem của một bài", () => {
  it("bài 10 phút có tối đa 72 ô (dư 20% vì thời lượng nhập tay)", () => {
    expect(getLessonMaxBucketCount({ duration: 10, video: "mux-id" })).toBe(72);
  });

  it("video Drive chưa nhập thời lượng thì không tính được", () => {
    expect(getLessonMaxBucketCount({ duration: 0, video: "" })).toBe(0);
  });

  it("video Mux chưa nhập thời lượng vẫn có trần", () => {
    expect(getLessonMaxBucketCount({ duration: 0, video: "mux-id" })).toBe(
      1440,
    );
  });

  it("bỏ ô ngoài khoảng, số lẻ, chuỗi và ô trùng", () => {
    expect(sanitizeBuckets([0, 3, 3, -1, 2.5, "4", 72, 71], 72)).toEqual([
      0, 3, 71,
    ]);
  });

  it("một lần gửi tối đa 200 ô", () => {
    const buckets = Array.from({ length: 500 }, (_, index) => index);

    expect(sanitizeBuckets(buckets, 1000)).toHaveLength(200);
  });
});

describe("giới hạn theo thời gian thật", () => {
  const now = new Date("2026-11-05T13:15:00.000Z");

  it("lần đầu được tối đa 90 giây", () => {
    expect(getCreditableSeconds(undefined, now)).toBe(90);
  });

  it("30 giây sau lần trước thì được tối đa 75 giây (gấp đôi + 15 giây bù mạng)", () => {
    const lastCreditAt = new Date(now.getTime() - 30 * 1000);

    expect(getCreditableSeconds(lastCreditAt, now)).toBe(75);
  });

  it("hai tab gửi sát nhau thì tab sau gần như không được cộng", () => {
    expect(getCreditableSeconds(now, now)).toBe(15);
  });
});

describe("phút hiển thị", () => {
  it("làm tròn xuống, chưa đủ phút chưa tính", () => {
    expect(toStudyMinutes(59)).toBe(0);
    expect(toStudyMinutes(119)).toBe(1);
    expect(toStudyMinutes(-5)).toBe(0);
  });
});
