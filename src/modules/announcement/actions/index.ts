"use server";

import UserModel from "@/modules/user/models";
import { FEATURE_ANNOUNCEMENT_ID } from "@/shared/constants/announcement.constants";
import { connectToDatabase } from "@/shared/libs";
import { getCurrentUser } from "@/shared/libs/auth";

/**
 * Ghi là người đang đăng nhập đã thấy đợt giới thiệu tính năng mới. Chỉ nhận
 * mã đợt đang chạy, để client không nhét chuỗi tuỳ ý vào bản ghi user
 */
export async function markFeatureAnnouncementSeen(
  announcementId: string,
): Promise<boolean> {
  try {
    if (announcementId !== FEATURE_ANNOUNCEMENT_ID) return false;

    const currentUser = await getCurrentUser();

    if (!currentUser) return false;

    await connectToDatabase();
    await UserModel.updateOne(
      { _id: currentUser._id },
      { $addToSet: { seenAnnouncements: announcementId } },
    );

    return true;
  } catch (error) {
    console.log(error);

    return false;
  }
}
