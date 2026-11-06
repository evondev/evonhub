import "server-only";

import UserModel from "@/modules/user/models";
import { connectToDatabase } from "@/shared/libs";
import { PipelineStage, Types } from "mongoose";
import { unstable_cache } from "next/cache";
import {
  DASHBOARD_TOP_COUNT,
  LEADERBOARD_CACHE_SECONDS,
  LEADERBOARD_CACHE_TAG,
  LEADERBOARD_LIMIT,
  MIN_RANKED_SECONDS,
  STUDY_DAY_CHART_LENGTH,
} from "../constants";
import { StudyDayModel, StudyTotalModel } from "../models";
import {
  LeaderboardData,
  LeaderboardEntry,
  LeaderboardPeriod,
  LeaderboardStanding,
  LeaderboardUserRow,
  PeriodRanking,
  PeriodSecondsRow,
  RankedSecondsRow,
  StudyDayPoint,
  WeekLeaderboardSummary,
} from "../types";
import {
  buildRecentStudyDayKeys,
  getPeriodStartDayKey,
  toStudyMinutes,
} from "../utils";
import {
  findTierLevelsByUser,
  getUserTierProgress,
} from "./study-progress.service";

interface StudyTotalRow {
  user: unknown;
  seconds: number;
}

interface StudyDayRow {
  day: string;
  seconds: number;
}

const DELETED_USER_NAME = "Học viên";

function toObjectId(userId: unknown): Types.ObjectId {
  return new Types.ObjectId(String(userId));
}

/**
 * Mọi người đủ một phút trong kỳ, nhiều xuống ít. startDayKey null là bảng
 * "Tất cả", đọc thẳng tổng giây thay vì gom cả lịch sử theo ngày.
 */
async function findPeriodRows(
  startDayKey: string | null,
): Promise<RankedSecondsRow[]> {
  if (!startDayKey) {
    const totals = await StudyTotalModel.find({
      seconds: { $gte: MIN_RANKED_SECONDS },
    })
      .sort({ seconds: -1, user: 1 })
      .select("user seconds")
      .lean<StudyTotalRow[]>();

    return totals.map((total) => ({
      userId: String(total.user),
      seconds: total.seconds,
    }));
  }

  const groupStages: PipelineStage[] = [
    { $match: { day: { $gte: startDayKey } } },
    { $group: { _id: "$user", seconds: { $sum: "$seconds" } } },
    { $match: { seconds: { $gte: MIN_RANKED_SECONDS } } },
    { $sort: { seconds: -1, _id: 1 } },
  ];
  const periodRows = await StudyDayModel.aggregate<PeriodSecondsRow>(groupStages);

  return periodRows.map((periodRow) => ({
    userId: String(periodRow._id),
    seconds: periodRow.seconds,
  }));
}

async function findUserNames(
  userIds: unknown[],
): Promise<Map<string, LeaderboardUserRow>> {
  if (userIds.length === 0) return new Map();

  const users = await UserModel.find({ _id: { $in: userIds } })
    .select("name username avatar")
    .lean<LeaderboardUserRow[]>();

  return new Map(users.map((user) => [String(user._id), user]));
}

function getDisplayName(user?: LeaderboardUserRow): string {
  return user?.name || user?.username || DELETED_USER_NAME;
}

/** Cùng số giây thì cùng hạng (1, 2, 2, 4), khớp với cách tính hạng của bạn */
async function buildEntries(
  rows: RankedSecondsRow[],
): Promise<LeaderboardEntry[]> {
  const userIds = rows.map((row) => row.userId);
  const [usersById, tierLevelsByUser] = await Promise.all([
    findUserNames(userIds),
    findTierLevelsByUser(userIds),
  ]);
  const entries: LeaderboardEntry[] = [];

  rows.forEach((row, index) => {
    const previousRow = rows[index - 1];
    const previousEntry = entries[index - 1];
    const isTied = previousRow && previousRow.seconds === row.seconds;
    const user = usersById.get(row.userId);

    entries.push({
      userId: row.userId,
      username: user?.username || "",
      name: getDisplayName(user),
      avatar: user?.avatar || "",
      minutes: toStudyMinutes(row.seconds),
      rank: isTied && previousEntry ? previousEntry.rank : index + 1,
      tierLevel: tierLevelsByUser.get(row.userId) || 0,
    });
  });

  return entries;
}

/**
 * Bảng của một kỳ, dùng chung cho mọi người xem: trong LEADERBOARD_CACHE_SECONDS
 * chỉ gom DB một lần, không nhân theo số người đang mở trang. Khoá cache có
 * ngày đầu kỳ, nên sang tuần, tháng mới là đọc bảng mới ngay, không chờ hết hạn.
 * Giữ đủ mọi người (không chỉ top 100) để tính được hạng của người ngoài top.
 */
const getCachedPeriodRanking = unstable_cache(
  async (startDayKey: string | null): Promise<PeriodRanking> => {
    await connectToDatabase();

    const rows = await findPeriodRows(startDayKey);

    return { rows, entries: await buildEntries(rows.slice(0, LEADERBOARD_LIMIT)) };
  },
  ["leaderboard-period-ranking"],
  { revalidate: LEADERBOARD_CACHE_SECONDS, tags: [LEADERBOARD_CACHE_TAG] },
);

function getPeriodRanking(period: LeaderboardPeriod): Promise<PeriodRanking> {
  return getCachedPeriodRanking(getPeriodStartDayKey(period));
}

/** Phút của chính bạn đọc mới, không qua cache: vừa học xong mở trang là thấy */
async function findUserPeriodSeconds(
  period: LeaderboardPeriod,
  userId: unknown,
): Promise<number> {
  const startDayKey = getPeriodStartDayKey(period);

  if (!startDayKey) {
    const total = await StudyTotalModel.findOne({ user: userId })
      .select("seconds")
      .lean<StudyTotalRow>();

    return total?.seconds || 0;
  }

  const [userRow] = await StudyDayModel.aggregate<PeriodSecondsRow>([
    { $match: { user: toObjectId(userId), day: { $gte: startDayKey } } },
    { $group: { _id: "$user", seconds: { $sum: "$seconds" } } },
  ]);

  return userRow?.seconds || 0;
}

/**
 * Hạng của bạn: phút mới của bạn đặt vào bảng đã cache của mọi người khác.
 * Bỏ dòng của chính bạn trong cache (có thể đã cũ) để không tự đứng trên mình.
 */
async function buildStanding(
  ranking: PeriodRanking,
  userId: unknown,
  seconds: number,
): Promise<LeaderboardStanding> {
  const minutes = toStudyMinutes(seconds);

  if (seconds < MIN_RANKED_SECONDS) return { rank: 0, minutes };

  const userKey = String(userId);
  const rowsAbove = ranking.rows.filter(
    (row) => row.userId !== userKey && row.seconds > seconds,
  );
  const standing: LeaderboardStanding = { rank: rowsAbove.length + 1, minutes };
  // rows xếp nhiều xuống ít: người cuối cùng còn hơn bạn là đích gần nhất
  const aboveRow = rowsAbove[rowsAbove.length - 1];

  if (!aboveRow) return standing;

  // Người trên nằm trong top 100 thì đã có tên trong cache, khỏi hỏi DB
  const cachedAboveName = ranking.entries.find(
    (entry) => entry.userId === aboveRow.userId,
  )?.name;
  const aboveName =
    cachedAboveName ||
    getDisplayName((await findUserNames([aboveRow.userId])).get(aboveRow.userId));

  return {
    ...standing,
    above: {
      name: aboveName,
      rank: rowsAbove.length,
      gapMinutes: Math.max(1, Math.ceil((aboveRow.seconds - seconds) / 60)),
    },
  };
}

export async function getUserStudyStanding(
  userId: unknown,
  period: LeaderboardPeriod,
): Promise<LeaderboardStanding> {
  await connectToDatabase();

  const [ranking, seconds] = await Promise.all([
    getPeriodRanking(period),
    findUserPeriodSeconds(period, userId),
  ]);

  return buildStanding(ranking, userId, seconds);
}

async function findRecentStudyDays(userId: unknown): Promise<StudyDayPoint[]> {
  const dayKeys = buildRecentStudyDayKeys(STUDY_DAY_CHART_LENGTH);
  const studyDays = await StudyDayModel.find({
    user: userId,
    day: { $gte: dayKeys[0].key },
  })
    .select("day seconds")
    .lean<StudyDayRow[]>();
  const secondsByDay = new Map(
    studyDays.map((studyDay) => [studyDay.day, studyDay.seconds]),
  );

  return dayKeys.map((dayKey) => ({
    ...dayKey,
    minutes: toStudyMinutes(secondsByDay.get(dayKey.key) || 0),
  }));
}

/** Dữ liệu trang Xếp hạng. viewerId null: khách hoặc admin, expert, không có thẻ của bạn */
export async function getLeaderboardData(
  period: LeaderboardPeriod,
  viewerId: unknown | null,
): Promise<LeaderboardData> {
  await connectToDatabase();

  const [ranking, viewerSeconds, studyDays, tierProgress] = await Promise.all([
    getPeriodRanking(period),
    viewerId ? findUserPeriodSeconds(period, viewerId) : 0,
    viewerId ? findRecentStudyDays(viewerId) : [],
    viewerId ? getUserTierProgress(viewerId) : null,
  ]);
  const standing = viewerId
    ? await buildStanding(ranking, viewerId, viewerSeconds)
    : null;

  return {
    entries: ranking.entries,
    participantCount: ranking.rows.length,
    standing,
    studyDays,
    tierProgress,
  };
}

/** Khối "Tuần này" trên dashboard: hạng của bạn và vài người dẫn đầu, cùng cache với trang Xếp hạng */
export async function getWeekLeaderboardSummary(
  userId: unknown,
): Promise<WeekLeaderboardSummary> {
  await connectToDatabase();

  const [ranking, seconds] = await Promise.all([
    getPeriodRanking("week"),
    findUserPeriodSeconds("week", userId),
  ]);

  return {
    standing: await buildStanding(ranking, userId, seconds),
    topEntries: ranking.entries.slice(0, DASHBOARD_TOP_COUNT),
  };
}
