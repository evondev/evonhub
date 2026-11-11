import "server-only";
import { UserStatus } from "@/shared/constants/user.constants";
import { UserLock } from "@/shared/types/user.types";
import { isUserLockExpired } from "@/shared/utils/user-lock.utils";
import UserModel from "../models";

interface UserLockSource {
  _id: unknown;
  status: string;
  lock?: UserLock | null;
}

/**
 * Khoá có hạn đã qua hạn thì mở lại ngay lúc người đó quay lại web, không cần
 * cron: khoá chỉ có ý nghĩa khi họ vào web. Sửa luôn bản ghi đang cầm trong tay
 * để nơi gọi đọc ra trạng thái mới. Phải gọi connectToDatabase trước
 */
export async function releaseExpiredUserLock(
  user: UserLockSource,
): Promise<void> {
  if (user.status !== UserStatus.Inactive || !isUserLockExpired(user.lock)) {
    return;
  }

  // Lọc lại theo hạn: admin vừa khoá lại với hạn mới thì không mở nhầm
  await UserModel.updateOne(
    {
      _id: user._id,
      status: UserStatus.Inactive,
      "lock.until": { $lte: new Date() },
    },
    { $set: { status: UserStatus.Active }, $unset: { lock: 1 } },
  );

  user.status = UserStatus.Active;
  user.lock = undefined;
}

/**
 * Mở mọi khoá đã qua hạn, cho trang quản lý thành viên: tab "Bị khoá" không
 * hiện người đã hết hạn mà chưa quay lại web. Phải gọi connectToDatabase trước
 */
export async function releaseExpiredUserLocks(): Promise<void> {
  await UserModel.updateMany(
    { status: UserStatus.Inactive, "lock.until": { $lte: new Date() } },
    { $set: { status: UserStatus.Active }, $unset: { lock: 1 } },
  );
}
