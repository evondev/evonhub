import {
  PREVIEW_LEADERBOARD_PEOPLE,
  PREVIEW_VIEWER,
  PREVIEW_VIEWER_DAY_MINUTES,
  PREVIEW_VIEWER_RANK,
  PREVIEW_VIEWER_TOTAL_HOURS,
  PREVIEW_VIEWER_WEEK_MINUTES,
} from "../constants/leaderboard-preview.constants";
import { DASHBOARD_TOP_COUNT, STREAK_DAY_COUNT } from "../constants";
import {
  LeaderboardData,
  LeaderboardEntry,
  LeaderboardPreviewState,
  LeaderboardStanding,
  StreakStatus,
  StudyStreak,
  WeekLeaderboardSummary,
} from "../types";
import {
  buildRecentStudyDayKeys,
  getStudyDayKey,
  shiftDayKey,
} from "./study-period.utils";
import { buildStudyStreak } from "./study-streak.utils";
import { getStudyTier, getTierProgress } from "./study-tier.utils";

const HOUR_SECONDS = 60 * 60;

/** length ngày liền nhau, ngày cuối cách hôm nay daysAgo ngày */
function buildDayRun(daysAgo: number, length: number, now: Date): string[] {
  const lastDayKey = shiftDayKey(getStudyDayKey(now), -daysAgo);

  return Array.from({ length }, (_, index) => shiftDayKey(lastDayKey, -index));
}

/** Chuỗi giả cho từng trạng thái của thẻ; kỷ lục cũ 21 ngày nằm cách xa */
export function buildPreviewStudyStreak(
  status: StreakStatus,
  now: Date = new Date(),
): StudyStreak {
  const oldRecordRun = buildDayRun(40, 21, now);
  const studiedDayKeysByStatus: Record<StreakStatus, string[]> = {
    risk: [...buildDayRun(1, 12, now), ...oldRecordRun],
    kept: [...buildDayRun(0, 13, now), ...oldRecordRun],
    record: buildDayRun(0, 22, now),
    broken: [...buildDayRun(2, 12, now), ...oldRecordRun],
    new: [],
  };

  return buildStudyStreak(studiedDayKeysByStatus[status], now);
}

function getPreviewViewerTotalHours(state: LeaderboardPreviewState): number {
  if (state === "bac-cao-nhat") return 196;

  if (state === "chua-co-phut") return 0;

  return PREVIEW_VIEWER_TOTAL_HOURS;
}

function buildPreviewStanding(
  state: LeaderboardPreviewState,
): LeaderboardStanding | null {
  if (state === "khach") return null;

  if (state === "chua-co-phut" || state === "rong") {
    return { rank: 0, minutes: 0 };
  }

  const personAbove = PREVIEW_LEADERBOARD_PEOPLE[PREVIEW_VIEWER_RANK - 2];

  return {
    rank: PREVIEW_VIEWER_RANK,
    minutes: PREVIEW_VIEWER_WEEK_MINUTES,
    above: {
      name: personAbove.name,
      rank: PREVIEW_VIEWER_RANK - 1,
      gapMinutes: personAbove.minutes - PREVIEW_VIEWER_WEEK_MINUTES,
    },
  };
}

/** Mọi người giả, bạn chen vào đúng hạng của mình như bảng thật */
function buildPreviewEntries(viewerTierLevel: number): LeaderboardEntry[] {
  const otherEntries = PREVIEW_LEADERBOARD_PEOPLE.map((person, index) => ({
    userId: `preview-${index + 1}`,
    username: "",
    name: person.name,
    avatar: person.avatar,
    minutes: person.minutes,
    rank: 0,
    tierLevel: getStudyTier(person.totalHours * HOUR_SECONDS)?.level || 0,
  }));
  const viewerEntry: LeaderboardEntry = {
    ...PREVIEW_VIEWER,
    minutes: PREVIEW_VIEWER_WEEK_MINUTES,
    rank: 0,
    tierLevel: viewerTierLevel,
  };
  const entries = [
    ...otherEntries.slice(0, PREVIEW_VIEWER_RANK - 1),
    viewerEntry,
    ...otherEntries.slice(PREVIEW_VIEWER_RANK - 1),
  ];

  return entries.map((entry, index) => ({ ...entry, rank: index + 1 }));
}

/** Bảng tuần giả cho trang xem trước. Không đọc DB */
export function buildPreviewLeaderboardData(
  state: LeaderboardPreviewState,
  now: Date = new Date(),
): LeaderboardData {
  const isGuest = state === "khach";
  const standing = buildPreviewStanding(state);
  const tierProgress = getTierProgress(
    getPreviewViewerTotalHours(state) * HOUR_SECONDS,
  );
  const isRanked = !!standing && standing.rank > 0;
  const studyDays = buildRecentStudyDayKeys(STREAK_DAY_COUNT, now).map(
    (dayKey, index) => ({
      ...dayKey,
      minutes: isRanked ? PREVIEW_VIEWER_DAY_MINUTES[index] || 0 : 0,
    }),
  );
  // Bạn chưa có phút tuần này thì không chen vào bảng
  const entries = buildPreviewEntries(tierProgress.tier?.level || 0).filter(
    (entry) => isRanked || entry.userId !== PREVIEW_VIEWER.userId,
  );

  if (state === "rong") {
    return {
      entries: [],
      participantCount: 0,
      standing,
      studyDays,
      tierProgress,
    };
  }

  return {
    entries,
    participantCount: 214,
    standing,
    studyDays: isGuest ? [] : studyDays,
    tierProgress: isGuest ? null : tierProgress,
  };
}

/** Panel "Tuần này" giả cho trang xem trước dashboard: có hạng hay chưa có phút */
export function buildPreviewWeekSummary(
  isRanked: boolean,
): WeekLeaderboardSummary {
  const standing = buildPreviewStanding(isRanked ? "du-lieu" : "chua-co-phut");

  return {
    standing: standing || { rank: 0, minutes: 0 },
    topEntries: buildPreviewEntries(0).slice(0, DASHBOARD_TOP_COUNT),
  };
}
