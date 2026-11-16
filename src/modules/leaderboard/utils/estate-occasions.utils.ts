import {
  CHRISTMAS_FROM_DAY,
  CHRISTMAS_TO_DAY,
  ESTATE_SEASON_BY_MONTH,
  MID_AUTUMN_DAYS,
  MID_AUTUMN_DAYS_AFTER,
  MID_AUTUMN_DAYS_BEFORE,
  TET_FIRST_DAYS,
  TET_SPAN_DAYS,
} from "../constants/estate.constants";
import { EstateOccasions } from "../types/estate.types";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Số ngày lịch từ ngày gần nhất trong bảng tới ngày đang xét (âm là trước ngày đó) */
function getDaysFromNearest(date: Date, dayKeys: string[]): number | null {
  const dayStart = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

  return dayKeys.reduce<number | null>((nearest, dayKey) => {
    const [year, month, day] = dayKey.split("-").map(Number);
    const offset = Math.round((dayStart - Date.UTC(year, month - 1, day)) / DAY_MS);

    return nearest === null || Math.abs(offset) < Math.abs(nearest) ? offset : nearest;
  }, null);
}

/** Mùa theo tháng; Giáng sinh 20–26/12; Tết ±7 ngày quanh mùng 1; Trung thu 7 ngày trước tới 1 ngày sau rằm */
export function getEstateOccasions(date: Date): EstateOccasions {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const daysFromTet = getDaysFromNearest(date, TET_FIRST_DAYS);
  const daysFromMidAutumn = getDaysFromNearest(date, MID_AUTUMN_DAYS);

  return {
    season: ESTATE_SEASON_BY_MONTH[month],
    isChristmas: month === 12 && day >= CHRISTMAS_FROM_DAY && day <= CHRISTMAS_TO_DAY,
    isTet: daysFromTet !== null && Math.abs(daysFromTet) <= TET_SPAN_DAYS,
    isMidAutumn:
      daysFromMidAutumn !== null &&
      daysFromMidAutumn >= -MID_AUTUMN_DAYS_BEFORE &&
      daysFromMidAutumn <= MID_AUTUMN_DAYS_AFTER,
  };
}

/** "2026-12-24" thành ngày giờ địa phương; sai định dạng thì null */
export function parseEstateDateKey(dateKey: string | null): Date | null {
  if (!dateKey || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return null;

  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day, 12);

  return Number.isNaN(date.getTime()) ? null : date;
}
