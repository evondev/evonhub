import "server-only";

import { connectToDatabase } from "@/shared/libs";
import { CreateUserParams } from "@/types";
import { EUserStatus } from "@/types/enums";
import UserModel from "../models";

// Chỉ webhook Clerk (đã kiểm chữ ký svix) gọi các hàm này. Không đặt trong file
// "use server": hàm trong đó thành endpoint ai cũng gọi được, kể cả chưa đăng nhập.

export async function createUserFromClerk(userData: CreateUserParams) {
  await connectToDatabase();

  return UserModel.create(userData);
}

interface SyncUserFromClerkParams {
  clerkId: string;
  email: string;
  avatar: string;
}

/** Clerk chỉ còn giữ email và ảnh; tên, username sửa ở trang Hồ sơ */
export async function syncUserFromClerk({
  clerkId,
  email,
  avatar,
}: SyncUserFromClerkParams) {
  await connectToDatabase();

  return UserModel.findOneAndUpdate(
    { clerkId },
    { $set: { email, avatar } },
    { new: true },
  );
}

/** Xoá ở Clerk thì chỉ khoá ở EvonHub, giữ lại đơn hàng, bình luận */
export async function deactivateUserFromClerk(clerkId: string) {
  await connectToDatabase();

  return UserModel.findOneAndUpdate(
    { clerkId },
    { $set: { status: EUserStatus.INACTIVE } },
    { new: true },
  );
}
