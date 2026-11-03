import { STUDY_TIERS } from "../constants";
import { StudyTier, TierProgress } from "../types";

/** Bậc cao nhất đã đủ giờ; chưa đủ phút đầu tiên thì chưa có bậc */
export function getStudyTier(totalSeconds: number): StudyTier | null {
  const reachedTiers = STUDY_TIERS.filter(
    (tier) => totalSeconds >= tier.minSeconds,
  );

  return reachedTiers[reachedTiers.length - 1] || null;
}

export function getStudyTierByLevel(level: number): StudyTier | null {
  return STUDY_TIERS.find((tier) => tier.level === level) || null;
}

export function getTierProgress(totalSeconds: number): TierProgress {
  const tier = getStudyTier(totalSeconds);
  const nextTier =
    STUDY_TIERS.find((studyTier) => studyTier.minSeconds > totalSeconds) ||
    null;

  if (!nextTier) {
    return { tier, nextTier, totalSeconds, remainingSeconds: 0, percent: 100 };
  }

  const tierStartSeconds = tier?.minSeconds || 0;
  const percent = Math.floor(
    ((totalSeconds - tierStartSeconds) /
      (nextTier.minSeconds - tierStartSeconds)) *
      100,
  );

  return {
    tier,
    nextTier,
    totalSeconds,
    remainingSeconds: nextTier.minSeconds - totalSeconds,
    percent: Math.min(100, Math.max(0, percent)),
  };
}

/** "27 giờ 40 phút", "3 giờ", "45 phút". roundUp cho số còn thiếu: 30 giây vẫn là 1 phút */
export function formatStudyDuration(seconds: number, roundUp = false): string {
  const safeSeconds = Math.max(0, seconds);
  const totalMinutes = roundUp
    ? Math.ceil(safeSeconds / 60)
    : Math.floor(safeSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} phút`;

  if (minutes === 0) return `${hours} giờ`;

  return `${hours} giờ ${minutes} phút`;
}
