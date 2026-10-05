"use server";

import CourseModel from "@/modules/course/models";
import LessonModel from "@/modules/lesson/models";
import UserModel from "@/modules/user/models";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import { getCurrentUser } from "@/shared/libs/auth";
import HistoryModel from "@/shared/models/history.model";
import { HistoryItemData } from "../types";

interface HistoriesByUserIdProps {
  /** Bỏ qua ở server, chỉ để client làm query key: luôn đọc lịch sử của session */
  userId?: string;
  courseId: string;
}

export async function fetchHistoriesByUserId({
  courseId,
}: HistoriesByUserIdProps): Promise<HistoryItemData[] | undefined> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return;

    await connectToDatabase();

    const histories = await HistoryModel.find({
      user: currentUser._id,
      course: courseId,
    })
      .populate({ path: "course", model: CourseModel, select: "title slug" })
      .populate({ path: "lesson", model: LessonModel, select: "title slug" })
      .populate({
        path: "user",
        model: UserModel,
        select: "name username avatar",
      });

    if (histories.length === 0) return undefined;

    return parseData(histories);
  } catch (error) {
    console.log("error:", error);
  }
}
