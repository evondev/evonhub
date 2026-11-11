import dayjs from "dayjs";
import {
  UserLockDuration,
  userLockDurationOptions,
} from "../constants/user.constants";
import { UserLock } from "../types/user.types";

/** Khoá có hạn và đã tới hạn. Khoá vĩnh viễn (until null) không bao giờ hết hạn */
export function isUserLockExpired(
  lock: Pick<UserLock, "until"> | null | undefined,
  now: Date = new Date(),
): boolean {
  if (!lock?.until) return false;

  return new Date(lock.until).getTime() <= now.getTime();
}

/**
 * Hạn mở khoá tính từ `now`. null là vĩnh viễn, undefined là mức thời hạn
 * không có trong danh sách (client gửi bậy)
 */
export function getUserLockUntil(
  duration: UserLockDuration,
  now: Date = new Date(),
): Date | null | undefined {
  const option = userLockDurationOptions.find(
    (durationOption) => durationOption.value === duration,
  );

  if (!option) return undefined;

  if (option.durationMs === null) return null;

  return new Date(now.getTime() + option.durationMs);
}

/** "14:00 15/11/2026"; khoá vĩnh viễn thì null */
export function formatUserLockUntil(
  until: Date | string | null | undefined,
): string | null {
  if (!until) return null;

  return dayjs(until).format("HH:mm DD/MM/YYYY");
}
