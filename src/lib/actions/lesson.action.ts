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
  order: number;
  lectureId: string;
  courseId: string;
}) {
  try {
    connectToDatabase();
    const findLecture = await Lecture.findById(params.lectureId);
    if (!findLecture) {
      throw new Error("Lecture not found");
    }
    const existLessonSlug = await Lesson.findOne({ slug: params.slug });
    if (existLessonSlug) {
      throw new Error("Lesson slug already exists");
    }
    const newLesson = new Lesson({
      ...params,
    });
    await newLesson.save();
    findLecture.lessons.push(newLesson._id);
    await findLecture.save();
    revalidatePath(`/admin/course/content?slug=${params.slug}`);
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
    const allLesson = await Lesson.find();
    const existLessonSlug = allLesson.find(
      (lesson) => lesson.slug === data.slug
    );
    if (existLessonSlug && existLessonSlug._id.toString() !== lessonId) {
      return {
        type: "error",
        message: "Đường dẫn bài học đã tồn tại!",
      };
    }

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
export async function getLessonByCourseId(
  courseId: string
): Promise<ILesson[] | undefined> {
  try {
    connectToDatabase();
    const lessons = await Lesson.find({ courseId });
    return lessons;
  } catch (error) {
    console.log(error);
  }
}
export async function getLessonCount(
  courseId: string
): Promise<number | undefined> {
  try {
    connectToDatabase();
    // count all lessons in course
    const count = await Lesson.countDocuments({ courseId });
    return count;
  } catch (error) {
    console.log(error);
  }
}
