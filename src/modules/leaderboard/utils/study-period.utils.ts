import {
  LEADERBOARD_PATH,
  LEADERBOARD_PERIOD_TABS,
  VIETNAM_UTC_OFFSET_MS,
  WEEKDAY_LABELS,
} from "../constants";
import { LeaderboardPeriod, LeaderboardPeriodTab, StudyDayKey } from "../types";

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

/** Dời mốc sang giờ Việt Nam: đọc các trường getUTC* là ra ngày giờ ở Việt Nam */
function toVietnamTime(date: Date): Date {
  return new Date(date.getTime() + VIETNAM_UTC_OFFSET_MS);
}

function toDayKey(vietnamTime: Date): string {
  return vietnamTime.toISOString().slice(0, 10);
}

/** Nửa đêm (giờ Việt Nam) của ngày chứa mốc, vẫn ở dạng đã dời */
function startOfVietnamDay(vietnamTime: Date): number {
  return Date.UTC(
    vietnamTime.getUTCFullYear(),
    vietnamTime.getUTCMonth(),
    vietnamTime.getUTCDate(),
  );
}

/** Thứ Hai đầu tuần, 0:00 giờ Việt Nam, ở dạng đã dời */
function startOfVietnamWeek(vietnamTime: Date): number {
  const daysSinceMonday = (vietnamTime.getUTCDay() + 6) % 7;

  return startOfVietnamDay(vietnamTime) - daysSinceMonday * DAY_MS;
}

/** "còn 3 ngày 4 giờ", "còn 5 giờ 12 phút", "còn 8 phút" */
function formatRemaining(remainingMs: number): string {
  const days = Math.floor(remainingMs / DAY_MS);
  const hours = Math.floor((remainingMs % DAY_MS) / HOUR_MS);
  const minutes = Math.max(1, Math.floor((remainingMs % HOUR_MS) / MINUTE_MS));

  if (days > 0)
    return hours > 0 ? `còn ${days} ngày ${hours} giờ` : `còn ${days} ngày`;

  if (hours > 0) return `còn ${hours} giờ ${minutes} phút`;

  return `còn ${minutes} phút`;
}

export function isLeaderboardPeriod(
  value: unknown,
): value is LeaderboardPeriod {
  return LEADERBOARD_PERIOD_TABS.some((tab) => tab.value === value);
}

/** Tham số ?period= từ URL; lạ hoặc thiếu thì về bảng tuần */
export function parseLeaderboardPeriod(value?: string): LeaderboardPeriod {
  return isLeaderboardPeriod(value) ? value : "week";
}

export function getLeaderboardPeriodTab(
  period: LeaderboardPeriod,
): LeaderboardPeriodTab {
  return (
    LEADERBOARD_PERIOD_TABS.find((tab) => tab.value === period) ||
    LEADERBOARD_PERIOD_TABS[0]
  );
}

/** Bảng tuần là mặc định nên không cần ?period=week trên URL */
export function getLeaderboardPeriodHref(period: LeaderboardPeriod): string {
  return period === "week"
    ? LEADERBOARD_PATH
    : `${LEADERBOARD_PATH}?period=${period}`;
}

/** Khoá ngày học theo giờ Việt Nam, dạng "2026-11-05" */
export function getStudyDayKey(now: Date = new Date()): string {
  return toDayKey(toVietnamTime(now));
}

/** Ngày đầu kỳ theo giờ Việt Nam; bảng "Tất cả" không có ngày đầu */
export function getPeriodStartDayKey(
  period: LeaderboardPeriod,
  now: Date = new Date(),
): string | null {
  const vietnamTime = toVietnamTime(now);

  if (period === "week")
    return toDayKey(new Date(startOfVietnamWeek(vietnamTime)));

  if (period === "month") return `${toDayKey(vietnamTime).slice(0, 7)}-01`;

  return null;
}

/** Câu dưới tab kỳ: khi nào bảng tính lại */
export function getPeriodResetLabel(
  period: LeaderboardPeriod,
  now: Date = new Date(),
): string {
  const vietnamTime = toVietnamTime(now);

  if (period === "week") {
    const nextWeekStart = startOfVietnamWeek(vietnamTime) + 7 * DAY_MS;

    return `Bảng tuần tính lại lúc 0:00 thứ Hai, ${formatRemaining(nextWeekStart - vietnamTime.getTime())}`;
  }

  if (period === "month") {
    const month = vietnamTime.getUTCMonth();
    const nextMonthStart = Date.UTC(vietnamTime.getUTCFullYear(), month + 1, 1);
    const nextMonthNumber = ((month + 1) % 12) + 1;

    return `Bảng tháng ${month + 1} tính lại lúc 0:00 ngày 1/${nextMonthNumber}, ${formatRemaining(nextMonthStart - vietnamTime.getTime())}`;
  }

  return "Cộng dồn từ khi bảng xếp hạng ra mắt";
}

/** Còn bao lâu tới 0:00 ngày mai giờ Việt Nam: "còn 2 giờ 20 phút" */
export function getDayEndRemainingLabel(now: Date = new Date()): string {
  const vietnamTime = toVietnamTime(now);
  const nextDayStart = startOfVietnamDay(vietnamTime) + DAY_MS;

  return formatRemaining(nextDayStart - vietnamTime.getTime());
}

/** Lùi hay tiến khoá ngày "2026-11-05" chừng này ngày */
export function shiftDayKey(dayKey: string, days: number): string {
  const dayStart = new Date(`${dayKey}T00:00:00.000Z`).getTime();

  return toDayKey(new Date(dayStart + days * DAY_MS));
}

/** Các ngày gần nhất, cũ trước mới sau; hôm nay ghi "Hôm nay" */
export function buildRecentStudyDayKeys(
  count: number,
  now: Date = new Date(),
): StudyDayKey[] {
  const todayStart = startOfVietnamDay(toVietnamTime(now));

  return Array.from({ length: count }, (_, index) => {
    const daysAgo = count - 1 - index;
    const day = new Date(todayStart - daysAgo * DAY_MS);

    return {
      key: toDayKey(day),
      label: daysAgo === 0 ? "Hôm nay" : WEEKDAY_LABELS[day.getUTCDay()],
      isToday: daysAgo === 0,
    };
  });
}

/** Giây sang phút hiển thị: làm tròn xuống, chưa đủ phút thì chưa tính */
export function toStudyMinutes(seconds: number): number {
  return Math.floor(Math.max(0, seconds) / 60);
}
