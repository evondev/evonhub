import "server-only";

import Course from "@/database/course.model";
import UserModel from "@/modules/user/models";
import { UserStatus } from "@/shared/constants/user.constants";
import { connectToDatabase } from "@/shared/libs";
import NotificationModel from "../models";
import { NotificationDraft, SendNotificationParams } from "../types";

/**
 * Chỉ code server gọi (action đã kiểm quyền). Không đặt trong file "use server":
 * nội dung hiện bằng HTML ở chuông thông báo, để ngỏ là ai cũng gửi được script.
 * Chữ do người dùng đặt (tên, tiêu đề) phải qua escapeHtml trước khi ghép vào content.
 */
export async function sendNotification({
  title,
  content,
  users = [],
  isSendAll,
}: SendNotificationParams) {
  try {
    await connectToDatabase();

    let recipientIds: unknown = users;

    if (isSendAll) {
      recipientIds = await UserModel.find({
        status: UserStatus.Active,
        courses: {
          $in: await Course.find({ _destroy: false }).distinct("_id"),
        },
      }).select("_id");
    }

    await NotificationModel.create({
      title,
      content,
      users: recipientIds,
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 * Ghi nhiều thông báo trong một lần insertMany thay vì mỗi thông báo một lần
 * create. ordered: false để một thông báo lỗi không chặn các thông báo còn lại.
 * Cùng lưu ý escapeHtml với sendNotification.
 */
export async function sendNotifications(notifications: NotificationDraft[]) {
  if (notifications.length === 0) return;

  try {
    await connectToDatabase();
    await NotificationModel.insertMany(notifications, { ordered: false });
  } catch (error) {
    console.log(error);
  }
}
