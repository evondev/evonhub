"use server";

import ScoreModel from "@/modules/score/models";
import UserModel from "@/modules/user/models";
import { connectToDatabase } from "@/shared/libs";
import HistoryModel from "@/shared/models/history.model";

export async function handleCompleteLesson({
  lessonId,
  userId,
  courseId,
  isSingleton = false,
}: {
  lessonId: string;
  userId: string;
  courseId: string;
  isSingleton?: boolean;
}): Promise<boolean | undefined> {
  try {
    connectToDatabase();
    const existHistory = await HistoryModel.findOne({
      lesson: lessonId,
      user: userId,
      course: courseId,
    });
    const existScore = await ScoreModel.findOne({ user: userId });
    if (!existHistory) {
      await HistoryModel.create({
        user: userId,
        course: courseId,
        lesson: lessonId,
      });
      await UserModel.findByIdAndUpdate(userId, {
        $inc: { score: 10 },
      });
      if (!existScore) {
        await ScoreModel.create({
          user: userId,
          score: 10,
        });
      } else {
        await ScoreModel.findByIdAndUpdate(existScore._id, {
          $inc: { score: 10 },
        });
      }
      return true;
    } else if (!isSingleton) {
      await HistoryModel.findOneAndDelete({
        lesson: lessonId,
        user: userId,
        course: courseId,
      });
      await UserModel.findByIdAndUpdate(userId, {
        $inc: { score: -10 },
      });
      if (existScore) {
        await ScoreModel.findByIdAndUpdate(existScore._id, {
          $inc: { score: -10 },
        });
      }
      return false;
    }
  } catch (error) {
    console.log("error:", error);
  }
}
