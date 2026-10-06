import "server-only";

import Course from "@/database/course.model";
import UserModel from "@/modules/user/models";
import { UserStatus } from "@/shared/constants/user.constants";
import { connectToDatabase } from "@/shared/libs";
import NotificationModel from "../models";
import { NotificationDraft, SendNotificationParams } from "../types";
import { pingNotificationRecipients } from "./ping-notification-recipients.service";

/**
 * Chỉ code server gọi (action đã kiểm quyền). Thông báo lưu type + data, câu hiển
 * thị ghép ở client bằng chữ thường, nên tên khóa, tên bài không cần escape.
 */
export async function sendNotification({
  type,
  data,
  users = [],
  isSendAll,
}: SendNotificationParams) {
  try {
    await connectToDatabase();

    let recipientIds = users.map(String);

    if (isSendAll) {
      const recipients = await UserModel.find({
        status: UserStatus.Active,
        courses: {
          $in: await Course.find({ _destroy: false }).distinct("_id"),
        },
      }).select("_id");

      recipientIds = recipients.map((recipient) => String(recipient._id));
    }

    await NotificationModel.create({
      type,
      data,
      users: recipientIds,
    });
    await pingNotificationRecipients(recipientIds);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Ghi nhiều thông báo trong một lần insertMany thay vì mỗi thông báo một lần
 * create. ordered: false để một thông báo lỗi không chặn các thông báo còn lại.
 */
export async function sendNotifications(notifications: NotificationDraft[]) {
  if (notifications.length === 0) return;

  try {
    await connectToDatabase();
    await NotificationModel.insertMany(notifications, { ordered: false });
    await pingNotificationRecipients(
      notifications.flatMap((notification) => notification.users),
    );
  } catch (error) {
    console.log(error);
  }
}
