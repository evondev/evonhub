"use server";

import Course from "@/database/course.model";
import Notification from "@/database/notification.model";
import User from "@/database/user.model";
import { EUserStatus } from "@/types/enums";
import { connectToDatabase } from "../mongoose";

export async function sendNotification(params: {
  title: string;
  content: string;
  users?: string[];
  isSendToAll?: boolean;
}) {
  try {
    connectToDatabase();
    let users: any = params.users;
    if (params.isSendToAll) {
      users = await User.find({
        status: EUserStatus.ACTIVE,
        courses: {
          $in: await Course.find({ _destroy: false }).distinct("_id"),
        },
      }).select("_id");
    }

    await Notification.create({
      title: params.title,
      content: params.content,
      users,
    });
  } catch (err) {
    console.log(err);
  }
}

export async function getNotificationByUser(userId: string) {
  try {
    connectToDatabase();
    // find notification users include userId
    const notifications = await Notification.find({ users: userId })
      .sort({
        createdAt: -1,
      })
      .limit(10);
    return notifications;
  } catch (err) {
    console.log(err);
  }
}
