"use server";

import Course from "@/database/course.model";
import UserModel from "@/modules/user/models";
import { UserStatus } from "@/shared/constants/user.constants";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import NotificationModel from "../models";
import { NotificationItemData, SendNotificationParams } from "../types";

export async function sendNotification({
  title,
  content,
  users = [],
  isSendAll,
}: SendNotificationParams) {
  try {
    connectToDatabase();

    let newUsers: any = users;

    if (isSendAll) {
      newUsers = await UserModel.find({
        status: UserStatus.Active,
        courses: {
          $in: await Course.find({ _destroy: false }).distinct("_id"),
        },
      }).select("_id");
    }

    await NotificationModel.create({
      title: title,
      content: content,
      users: newUsers,
    });
  } catch (err) {
    console.log(err);
  }
}

export async function fetchNotificationsByUser(
  userId: string
): Promise<NotificationItemData[] | undefined> {
  try {
    connectToDatabase();
    if (!userId) return;

    const notifications = await NotificationModel.find({
      users: userId,
    })
      .sort({
        createdAt: -1,
      })

      .limit(20);

    return parseData(notifications);
  } catch (err) {
    console.log(err);
  }
}
