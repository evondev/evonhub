"use server";
import History from "@/database/history.model";
import { connectToDatabase } from "../mongoose";
interface IHistoryLesson {
  lesson: string;
  user: string;
  course: string;
}
export async function getHistories(): Promise<IHistoryLesson[] | undefined> {
  try {
    connectToDatabase();
    const histories = await History.find().select("lesson user course");
    return histories;
  } catch (error) {
    console.log("error:", error);
  }
}
export async function completeLesson({
  lessonId,
  userId,
  courseId,
}: {
  lessonId: string;
  userId: string;
  courseId: string;
}): Promise<void> {
  try {
    connectToDatabase();
    const existHistory = await History.findOne({
      lesson: lessonId,
      user: userId,
      course: courseId,
    });
    if (!existHistory) {
      await History.create({
        user: userId,
        course: courseId,
        lesson: lessonId,
      });
    } else {
      await History.findOneAndDelete({
        lesson: lessonId,
      });
    }
  } catch (error) {
    console.log("error:", error);
  }
}
