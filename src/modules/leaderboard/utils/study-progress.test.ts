import { describe, expect, it } from "vitest";
import {
  buildStudyStreak,
  formatStudyDuration,
  getDayEndRemainingLabel,
  getStreakStatus,
  getStudyTier,
  getTierProgress,
  shiftDayKey,
} from "./index";

const HOUR_SECONDS = 60 * 60;

// Thứ Ba 03/11/2026, 21:40 giờ Việt Nam
const tuesdayNight = new Date("2026-11-03T14:40:00.000Z");

/** Các ngày liền nhau, kết thúc ở lastDayKey */
function buildDayRun(lastDayKey: string, length: number): string[] {
  return Array.from({ length }, (_, index) => shiftDayKey(lastDayKey, -index));
}

describe("bậc học theo tổng giờ", () => {
  it("chưa đủ một phút thì chưa có bậc", () => {
    expect(getStudyTier(0)).toBeNull();
    expect(getStudyTier(59)).toBeNull();
    expect(getStudyTier(60)?.level).toBe(1);
  });

  it("đúng mốc là lên bậc", () => {
    expect(getStudyTier(HOUR_SECONDS - 1)?.level).toBe(1);
    expect(getStudyTier(HOUR_SECONDS)?.level).toBe(2);
    expect(getStudyTier(500 * HOUR_SECONDS)?.level).toBe(10);
  });

  it("tiến độ tính trong khoảng từ bậc hiện tại tới bậc kế", () => {
    // 27 giờ 40 phút: bậc 7 (25 giờ), bậc 8 ở 40 giờ
    const progress = getTierProgress(27 * HOUR_SECONDS + 40 * 60);

    expect(progress.tier?.level).toBe(7);
    expect(progress.nextTier?.level).toBe(8);
    expect(progress.percent).toBe(17);
    expect(formatStudyDuration(progress.remainingSeconds, true)).toBe(
      "12 giờ 20 phút",
    );
  });

  it("bậc cao nhất thì đầy thanh, không còn bậc kế", () => {
    const progress = getTierProgress(200 * HOUR_SECONDS);

    expect(progress.nextTier).toBeNull();
    expect(progress.percent).toBe(100);
    expect(progress.remainingSeconds).toBe(0);
  });

  it("người mới đếm từ 0 tới phút đầu tiên", () => {
    const progress = getTierProgress(0);

    expect(progress.tier).toBeNull();
    expect(progress.nextTier?.level).toBe(1);
    expect(progress.percent).toBe(0);
  });
});

describe("chuỗi ngày học", () => {
  it("hôm nay chưa học thì chuỗi vẫn tính tới hôm qua, đang có nguy cơ mất", () => {
    const streak = buildStudyStreak(
      buildDayRun("2026-11-02", 12),
      tuesdayNight,
    );

    expect(streak.current).toBe(12);
    expect(streak.isTodayStudied).toBe(false);
    expect(getStreakStatus(streak)).toBe("risk");
  });

  it("hôm nay đã học thì cộng cả hôm nay", () => {
    const streak = buildStudyStreak(buildDayRun("2026-11-03", 5), tuesdayNight);

    expect(streak.current).toBe(5);
    expect(getStreakStatus(streak)).toBe("record");
  });

  it("bỏ hôm qua là đứt, kỷ lục vẫn giữ", () => {
    const streak = buildStudyStreak(
      [...buildDayRun("2026-11-01", 21), "2026-10-01"],
      tuesdayNight,
    );

    expect(streak.current).toBe(0);
    expect(streak.longest).toBe(21);
    expect(getStreakStatus(streak)).toBe("broken");
  });

  it("chưa học ngày nào là người mới", () => {
    const streak = buildStudyStreak([], tuesdayNight);

    expect(streak.current).toBe(0);
    expect(getStreakStatus(streak)).toBe("new");
  });

  it("đã giữ chuỗi nhưng chưa vượt kỷ lục", () => {
    const streak = buildStudyStreak(
      [...buildDayRun("2026-11-03", 3), ...buildDayRun("2026-10-20", 10)],
      tuesdayNight,
    );

    expect(streak.current).toBe(3);
    expect(streak.longest).toBe(10);
    expect(getStreakStatus(streak)).toBe("kept");
  });

  it("7 chấm gần nhất, hôm nay ở cuối", () => {
    const streak = buildStudyStreak(
      buildDayRun("2026-11-02", 12),
      tuesdayNight,
    );
    const studiedFlags = streak.recentDays.map((day) => day.isStudied);

    expect(streak.recentDays).toHaveLength(7);
    expect(streak.recentDays[6].isToday).toBe(true);
    expect(studiedFlags).toEqual([true, true, true, true, true, true, false]);
  });

  it("qua tháng vẫn liền mạch", () => {
    expect(shiftDayKey("2026-11-01", -1)).toBe("2026-10-31");
    expect(shiftDayKey("2026-12-31", 1)).toBe("2027-01-01");
  });

  it("còn bao lâu hết ngày theo giờ Việt Nam", () => {
    expect(getDayEndRemainingLabel(tuesdayNight)).toBe("còn 2 giờ 20 phút");
  });
});
