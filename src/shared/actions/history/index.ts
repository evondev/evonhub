"use server";

import { connectToDatabase } from "@/shared/libs";
import HistoryModel from "@/shared/models/history.model";

export async function handleCompleteLesson({
  lessonId,
  userId,
  courseId,
}: {
  lessonId: string;
  userId: string;
  courseId: string;
}): Promise<boolean | undefined> {
  try {
    connectToDatabase();
    const existHistory = await HistoryModel.findOne({
      lesson: lessonId,
      user: userId,
      course: courseId,
    });
    if (!existHistory) {
      await HistoryModel.create({
        user: userId,
        course: courseId,
        lesson: lessonId,
      });
      return true;
    } else {
      await HistoryModel.findOneAndDelete({
        lesson: lessonId,
        user: userId,
        course: courseId,
      });
      return false;
    }
  } catch (error) {
    console.log("error:", error);
  }
}
