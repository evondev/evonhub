"use server";

import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import HistoryModel from "@/shared/models/history.model";
import { HistoryItemData } from "../types";

interface HistoriesByUserIdProps {
  userId: string;
  courseId: string;
}
export async function fetchHistoriesByUserId({
  userId,
  courseId,
}: HistoriesByUserIdProps): Promise<HistoryItemData[] | undefined> {
  try {
    connectToDatabase();
    const histories = await HistoryModel.find({
      user: userId,
      course: courseId,
    })
      .populate("course")
      .populate("lesson")
      .populate("user");
    if (histories.length === 0) return undefined;
    return parseData(histories);
  } catch (error) {
    console.log("error:", error);
  }
}
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
