"use server";
import History from "@/database/history.model";
import { revalidatePath } from "next/cache";
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
  path,
}: {
  lessonId: string;
  userId: string;
  courseId: string;
  path?: string;
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
        user: userId,
        course: courseId,
      });
    }
    revalidatePath(path || "/");
  } catch (error) {
    console.log("error:", error);
  }
}
