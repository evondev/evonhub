import History from "@/database/history.model";
import { connectToDatabase } from "../mongoose";

export async function completeLesson(
  lessonId: string,
  userId: string,
  courseId: string
): Promise<void> {
  try {
    connectToDatabase();
    await History.create({
      user: userId,
      course: courseId,
      lesson: lessonId,
    });
  } catch (error) {
    console.log("error:", error);
  }
}
