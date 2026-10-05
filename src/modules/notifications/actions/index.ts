"use server";

import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import { getCurrentUser } from "@/shared/libs/auth";
import NotificationModel from "../models";
import { NotificationItemData } from "../types";

/**
 * Thông báo của người đang đăng nhập. Tham số `userId` chỉ còn để client làm
 * query key, server không dùng.
 */
export async function fetchNotificationsByUser(
  _userId?: string,
): Promise<NotificationItemData[] | undefined> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return;

    await connectToDatabase();

    // Bỏ `users`: thông báo gửi tất cả chứa id của mọi học viên
    const notifications = await NotificationModel.find({
      users: currentUser._id,
    })
      .select("title content createdAt")
      .sort({
        createdAt: -1,
      })
      .limit(20);

    return parseData(notifications);
  } catch (error) {
    console.log(error);
  }
}
