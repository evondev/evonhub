"use server";

import { connectToDatabase } from "@/shared/libs";
import LessonModel from "../models";

export async function getLessonById(lessonId: string) {
  try {
    connectToDatabase();
    const foundLesson = await LessonModel.findById(lessonId);
    if (!foundLesson) {
      throw new Error("Lesson not found");
    }
    return JSON.parse(JSON.stringify(foundLesson));
  } catch (error) {
    console.log(error);
  }
}
