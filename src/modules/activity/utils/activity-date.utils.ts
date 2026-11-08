import dayjs, { Dayjs } from "dayjs";
import {
  ACTIVITY_DATE_FORMAT,
  ACTIVITY_DATE_PRESET_LABELS,
  ACTIVITY_TIMEZONE_OFFSET,
} from "../constants";
import {
  ActivityDatePreset,
  ActivityDatePresetKey,
  ActivityDateRangeQuery,
} from "../types";

const activityDatePattern = /^\d{4}-\d{2}-\d{2}$/;

/** Chuỗi YYYY-MM-DD có thật trên lịch; "2026-02-31" hay object từ client thì không */
export function isActivityDateString(value: unknown): value is string {
  if (typeof value !== "string" || !activityDatePattern.test(value)) {
    return false;
  }

  // dayjs đẩy ngày tràn sang tháng sau (31/02 thành 03/03), format lại sẽ lệch
  return dayjs(value).format(ACTIVITY_DATE_FORMAT) === value;
}

/** 0 giờ của ngày đó theo giờ Việt Nam */
function getActivityDayStart(date: string): Date {
  return new Date(`${date}T00:00:00${ACTIVITY_TIMEZONE_OFFSET}`);
}

/**
 * Điều kiện lastSeenAt cho bộ lọc ngày, tính cả ngày cuối. Ngày sai dạng thì bỏ
 * chặn đầu đó; chọn ngược (đầu sau cuối) thì đổi chỗ. Không chặn gì thì null
 */
export function buildActivityDateRangeQuery(
  from: unknown,
  to: unknown,
): ActivityDateRangeQuery | null {
  const validFrom = isActivityDateString(from) ? from : "";
  const validTo = isActivityDateString(to) ? to : "";

  if (!validFrom && !validTo) return null;

  const isReversed = Boolean(validFrom && validTo && validFrom > validTo);
  const startDate = isReversed ? validTo : validFrom;
  const endDate = isReversed ? validFrom : validTo;
  const dateRangeQuery: ActivityDateRangeQuery = {};

  if (startDate) dateRangeQuery.$gte = getActivityDayStart(startDate);

  if (endDate) {
    const nextDay = dayjs(endDate).add(1, "day").format(ACTIVITY_DATE_FORMAT);

    dateRangeQuery.$lt = getActivityDayStart(nextDay);
  }

  return dateRangeQuery;
}

/** Mốc thời gian có nằm trong khoảng ngày đang lọc không (trang xem trước lọc tại chỗ) */
export function isInActivityDateRange(
  date: string,
  from: string,
  to: string,
): boolean {
  const dateRangeQuery = buildActivityDateRangeQuery(from, to);

  if (!dateRangeQuery) return true;

  const time = new Date(date).getTime();
  const isAfterStart =
    !dateRangeQuery.$gte || time >= dateRangeQuery.$gte.getTime();
  const isBeforeEnd =
    !dateRangeQuery.$lt || time < dateRangeQuery.$lt.getTime();

  return isAfterStart && isBeforeEnd;
}

function buildActivityDatePreset(
  key: ActivityDatePresetKey,
  fromDay: Dayjs,
  toDay: Dayjs,
): ActivityDatePreset {
  return {
    key,
    label: ACTIVITY_DATE_PRESET_LABELS[key],
    from: fromDay.format(ACTIVITY_DATE_FORMAT),
    to: toDay.format(ACTIVITY_DATE_FORMAT),
  };
}

/** Các lựa chọn nhanh, tính từ hôm nay; "7 ngày qua" gồm cả hôm nay */
export function buildActivityDatePresets(today: Dayjs): ActivityDatePreset[] {
  const yesterday = today.subtract(1, "day");

  return [
    buildActivityDatePreset("today", today, today),
    buildActivityDatePreset("yesterday", yesterday, yesterday),
    buildActivityDatePreset("last7Days", today.subtract(6, "day"), today),
    buildActivityDatePreset("last30Days", today.subtract(29, "day"), today),
  ];
}

/** Lựa chọn nhanh trùng đúng khoảng đang lọc, để nút ghi "Hôm nay" thay vì ngày */
export function findActivityDatePreset(
  presets: ActivityDatePreset[],
  from: string,
  to: string,
): ActivityDatePreset | undefined {
  return presets.find((preset) => preset.from === from && preset.to === to);
}

function formatActivityDay(date: string, format: string): string {
  return dayjs(date).format(format);
}

/**
 * Chữ trên nút lọc ngày: "Hôm nay", "08/11/2026", "01/11 – 08/11/2026", "Từ
 * 01/11/2026". Không lọc thì rỗng
 */
export function formatActivityDateRangeLabel(
  presets: ActivityDatePreset[],
  from: string,
  to: string,
): string {
  const matchedPreset = findActivityDatePreset(presets, from, to);

  if (matchedPreset) return matchedPreset.label;

  if (from && to && from === to) return formatActivityDay(from, "DD/MM/YYYY");

  if (from && to) {
    const isSameYear = from.slice(0, 4) === to.slice(0, 4);
    const fromFormat = isSameYear ? "DD/MM" : "DD/MM/YYYY";

    return `${formatActivityDay(from, fromFormat)} – ${formatActivityDay(to, "DD/MM/YYYY")}`;
  }

  if (from) return `Từ ${formatActivityDay(from, "DD/MM/YYYY")}`;

  if (to) return `Đến ${formatActivityDay(to, "DD/MM/YYYY")}`;

  return "";
}
