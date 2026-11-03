import "server-only";

import { connectToDatabase } from "@/shared/libs";
import { STREAK_MIN_SECONDS } from "../constants";
import { StudyDayModel, StudyTotalModel } from "../models";
import { StudyStreak, TierProgress } from "../types";
import { buildStudyStreak, getStudyTier, getTierProgress } from "../utils";

interface StudyTotalRow {
  user: unknown;
  seconds: number;
}

interface StudiedDayRow {
  day: string;
}

/** Bậc của nhiều người một lần, theo tổng giờ; người chưa có dòng tổng thì 0 */
export async function findTierLevelsByUser(
  userIds: unknown[],
): Promise<Map<string, number>> {
  if (userIds.length === 0) return new Map();

  const totals = await StudyTotalModel.find({ user: { $in: userIds } })
    .select("user seconds")
    .lean<StudyTotalRow[]>();

  return new Map(
    totals.map((total) => [
      String(total.user),
      getStudyTier(total.seconds)?.level || 0,
    ]),
  );
}

export async function getUserTierProgress(
  userId: unknown,
): Promise<TierProgress> {
  await connectToDatabase();

  const total = await StudyTotalModel.findOne({ user: userId })
    .select("seconds")
    .lean<StudyTotalRow>();

  return getTierProgress(total?.seconds || 0);
}

/**
 * Chuỗi ngày học của một người. Đọc hết các ngày đã đủ phút: mỗi người một
 * dòng mỗi ngày nên số dòng không quá số ngày từ khi bảng ra mắt, và cần đủ
 * cả lịch sử mới tính được kỷ lục.
 */
export async function getStudyStreak(userId: unknown): Promise<StudyStreak> {
  await connectToDatabase();

  const studiedDays = await StudyDayModel.find({
    user: userId,
    seconds: { $gte: STREAK_MIN_SECONDS },
  })
    .select("day")
    .lean<StudiedDayRow[]>();

  return buildStudyStreak(studiedDays.map((studiedDay) => studiedDay.day));
}
