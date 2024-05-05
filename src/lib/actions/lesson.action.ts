"use server";
import Lecture from "@/database/lecture.model";
import Lesson, { ILesson } from "@/database/lesson.model";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";

export async function addLesson(params: {
  title: string;
  slug: string;
  video: string;
  content: string;
  type: string;
  lectureId: string;
  courseId: string;
}) {
  try {
    connectToDatabase();
    const findLecture = await Lecture.findById(params.lectureId);
    if (!findLecture) {
      throw new Error("Lecture not found");
    }
    const newLesson = new Lesson({
      ...params,
    });
    await newLesson.save();
    findLecture.lessons.push(newLesson._id);
    await findLecture.save();
  } catch (error) {
    console.log(error);
  }
}
export async function deleteLesson({
  lessonId,
  lectureId,
  path,
}: {
  lessonId: string;
  lectureId: string;
  path: string;
}) {
  try {
    connectToDatabase();
    const findLecture = await Lecture.findById(lectureId);
    if (!findLecture) {
      throw new Error("Lecture not found");
    }
    await Lesson.findByIdAndDelete(lessonId);
    findLecture.lessons = findLecture.lessons.filter(
      (id: string) => id.toString() !== lessonId
    );
    await findLecture.save();
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
export async function updateLesson({
  lessonId,
  data,
  path,
}: {
  lessonId: string;
  data: Partial<ILesson>;
  path: string;
}) {
  try {
    connectToDatabase();
    await Lesson.findByIdAndUpdate(lessonId, data);
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
export async function getLessonsByLectureId(lectureId: string) {
  try {
    connectToDatabase();
    const lessons = await Lesson.find({ lectureId });
    return lessons;
  } catch (error) {
    console.log(error);
  }
}
export async function getLessonBySlug(
  slug: string
): Promise<ILesson | undefined> {
  try {
    connectToDatabase();
    const lesson = await Lesson.findOne({ slug });
    return lesson;
  } catch (error) {
    console.log(error);
  }
}
