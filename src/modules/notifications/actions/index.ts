"use server";

import UserModel from "@/modules/user/models";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import { getCurrentUser } from "@/shared/libs/auth";
import NotificationModel from "../models";
import { NotificationFeedData } from "../types";

/**
 * Thông báo của người đang đăng nhập, kèm mốc xem lần cuối để biết cái nào
 * chưa đọc. Tham số `userId` chỉ còn để client làm query key, server không dùng.
 */
export async function fetchNotificationsByUser(
  _userId?: string,
): Promise<NotificationFeedData | undefined> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return;

    await connectToDatabase();

    // Bỏ `users`: thông báo gửi tất cả chứa id của mọi học viên
    const notifications = await NotificationModel.find({
      users: currentUser._id,
    })
      .select("type data title content createdAt")
      .sort({
        createdAt: -1,
      })
      .limit(20);

    return {
      notifications: parseData(notifications),
      seenAt: currentUser.notificationsSeenAt?.toISOString() ?? null,
    };
  } catch (error) {
    console.log(error);
  }
}

/**
 * Ghi mốc đã xem tới thông báo mới nhất đang hiện. Nhận mốc từ client chứ không
 * lấy giờ hiện tại, để thông báo tới giữa lúc mở panel vẫn còn là chưa đọc.
 * $max: mốc chỉ tiến, không lùi.
 */
export async function markNotificationsSeen(
  seenAt: string,
): Promise<string | undefined> {
  try {
    const seenDate = new Date(seenAt);

    if (Number.isNaN(seenDate.getTime())) return;

    const currentUser = await getCurrentUser();

    if (!currentUser) return;

    // Không cho client đặt mốc ở tương lai để ẩn trước thông báo chưa tới
    const cappedSeenDate = new Date(Math.min(seenDate.getTime(), Date.now()));

    await connectToDatabase();
    await UserModel.updateOne(
      { _id: currentUser._id },
      { $max: { notificationsSeenAt: cappedSeenDate } },
    );

    return cappedSeenDate.toISOString();
  } catch (error) {
    console.log(error);
  }
}
