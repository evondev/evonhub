import {
  USER_LOCK_REASON_MAX_LENGTH,
  UserLockDuration,
  UserStatus,
} from "@/shared/constants/user.constants";
import { UserLockInput, UserModelProps } from "@/shared/types/user.types";
import { getUserLockUntil } from "@/shared/utils/user-lock.utils";
import { UpdateQuery } from "mongoose";

/**
 * Lệnh ghi khi đổi trạng thái: mở khoá thì xoá luôn thông tin khoá; khoá thì
 * ghi hạn và lý do (không gửi lock là khoá vĩnh viễn). null khi thời hạn không
 * hợp lệ. Không tin dữ liệu client: lý do cắt về độ dài tối đa
 */
export function buildUserStatusUpdate(
  status: UserStatus,
  lock?: UserLockInput,
  now: Date = new Date(),
): UpdateQuery<UserModelProps> | null {
  if (status === UserStatus.Active) {
    return { $set: { status }, $unset: { lock: 1 } };
  }

  const until = getUserLockUntil(
    lock?.duration ?? UserLockDuration.Forever,
    now,
  );

  if (until === undefined) return null;

  const reason =
    typeof lock?.reason === "string"
      ? lock.reason.trim().slice(0, USER_LOCK_REASON_MAX_LENGTH)
      : "";

  return { $set: { status, lock: { reason, until, at: now } } };
}
