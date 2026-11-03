import { STREAK_DAY_COUNT } from "../constants";
import { StreakStatus, StudyStreak } from "../types";
import {
  buildRecentStudyDayKeys,
  getStudyDayKey,
  shiftDayKey,
} from "./study-period.utils";

/** Chuỗi dài nhất trong các khoá ngày đã học (không cần sắp sẵn) */
function countLongestStreak(studiedDayKeys: string[]): number {
  const sortedDayKeys = Array.from(new Set(studiedDayKeys)).sort();
  let longest = 0;
  let running = 0;

  sortedDayKeys.forEach((dayKey, index) => {
    const isNextDay =
      index > 0 && shiftDayKey(sortedDayKeys[index - 1], 1) === dayKey;

    running = isNextDay ? running + 1 : 1;
    longest = Math.max(longest, running);
  });

  return longest;
}

/**
 * Chuỗi ngày học từ các khoá ngày đã đủ phút. Hôm nay chưa học thì chuỗi vẫn
 * còn, tính tới hôm qua; qua 0:00 mà hôm qua cũng không học thì về 0.
 */
export function buildStudyStreak(
  studiedDayKeys: string[],
  now: Date = new Date(),
): StudyStreak {
  const studiedDays = new Set(studiedDayKeys);
  const todayKey = getStudyDayKey(now);
  const isTodayStudied = studiedDays.has(todayKey);
  let cursorDayKey = isTodayStudied ? todayKey : shiftDayKey(todayKey, -1);
  let current = 0;

  while (studiedDays.has(cursorDayKey)) {
    current += 1;
    cursorDayKey = shiftDayKey(cursorDayKey, -1);
  }

  const recentDays = buildRecentStudyDayKeys(STREAK_DAY_COUNT, now).map(
    (dayKey) => ({ ...dayKey, isStudied: studiedDays.has(dayKey.key) }),
  );

  return {
    current,
    longest: Math.max(current, countLongestStreak(studiedDayKeys)),
    isTodayStudied,
    hasStudied: studiedDays.size > 0,
    recentDays,
  };
}

/** Thẻ chuỗi đang ở trạng thái nào, để chọn câu và màu */
export function getStreakStatus(streak: StudyStreak): StreakStatus {
  if (!streak.hasStudied) return "new";

  if (streak.current === 0) return "broken";

  if (!streak.isTodayStudied) return "risk";

  // Kỷ lục mới chỉ đáng nói khi đã hơn một ngày
  if (streak.current === streak.longest && streak.current > 1) return "record";

  return "kept";
}

/** Câu của thẻ chuỗi theo trạng thái; todayRemainingLabel là "còn 2 giờ 20 phút" */
export function getStreakStatusText(
  status: StreakStatus,
  current: number,
  todayRemainingLabel: string,
): string {
  if (status === "new") return "Học ít nhất 1 phút mỗi ngày để bắt đầu chuỗi";

  if (status === "risk") {
    return `Hôm nay chưa học, ${todayRemainingLabel} để giữ chuỗi`;
  }

  if (status === "kept") return "Đã giữ chuỗi hôm nay. Mai gặp lại";

  if (status === "record") return `Kỷ lục mới: ${current} ngày liên tiếp`;

  return "Chuỗi đã dừng. Học hôm nay để bắt đầu lại";
}
