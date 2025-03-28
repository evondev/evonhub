"use server";

import CourseModel from "@/modules/course/models";
import LectureModel from "@/modules/lecture/models";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import {
  LessonDetailsOutlineData,
  LessonItemCutomizeData,
  LessonItemData,
  UpdateLessonDragProps,
  UpdateLessonOrderProps,
  UpdateLessonProps,
} from "@/shared/types";
import { revalidatePath } from "next/cache";
import LessonModel from "../models";

export async function getLessonById(
  lessonId: string
): Promise<LessonItemCutomizeData | undefined> {
  try {
    connectToDatabase();
    const foundLesson = await LessonModel.findById(lessonId).populate({
      path: "courseId",
      model: CourseModel,
      select: "id slug",
    });
    if (!foundLesson) {
      throw new Error("Lesson not found");
    }
    return parseData(foundLesson);
  } catch (error) {
    console.log(error);
  }
}
export async function getLessonPreview(
  lessonId: string
): Promise<LessonItemCutomizeData | undefined> {
  try {
    connectToDatabase();
    const foundLesson = await LessonModel.findById(lessonId).select("trial");
    if (!foundLesson) {
      throw new Error("Lesson not found");
    }
    return parseData(foundLesson);
  } catch (error) {
    console.log(error);
  }
}

export async function fetchLessonDetailsOutline(
  slug: string
): Promise<LessonDetailsOutlineData[] | undefined> {
  try {
    connectToDatabase();
    const foundCourse = await CourseModel.findOne({ slug }).select("_id");
    if (!foundCourse) return [];
    const lectureList = await LectureModel.find({
      courseId: foundCourse._id,
      _destroy: false,
    })
      .select("title lessons")
      .sort({ order: 1 })
      .populate({
        path: "courseId",
        model: CourseModel,
        select: "id",
      })
      .populate({
        path: "lessons",
        model: LessonModel,
        select: "_id title slug user course order duration trial",
        match: { _destroy: false },
        options: {
          sort: { order: 1 },
        },
        populate: {
          path: "lectureId",
          model: LectureModel,
          select: "id title",
        },
      });
    if (!lectureList) return [];
    return parseData(lectureList);
  } catch (error) {}
}

export async function fetchLessonsByCourseId(
  courseId: string
): Promise<LessonItemData[] | undefined> {
  try {
    connectToDatabase();
    const lessons = await LessonModel.find({ courseId });
    if (!lessons) return [];
    return JSON.parse(JSON.stringify(lessons));
  } catch (error) {}
}

export async function updateLesson({
  lessonId,
  data,
  path,
}: UpdateLessonProps) {
  try {
    connectToDatabase();
    const allLesson = await LessonModel.find();
    const existLessonSlug = allLesson.find(
      (lesson) => lesson.slug === data.slug && lesson.courseId === data.courseId
    );
    if (existLessonSlug && existLessonSlug._id.toString() !== lessonId) {
      return {
        type: "error",
        message: "Đường dẫn bài học đã tồn tại!",
      };
    }
    await LessonModel.findByIdAndUpdate(lessonId, data);

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function updateLessonDrag({
  lessons,
  path,
}: UpdateLessonDragProps) {
  try {
    connectToDatabase();

    await Promise.all(
      lessons.map(async (lesson, index) => {
        await updateLesson({
          lessonId: lesson._id,
          path,
          data: {
            lectureId: lesson.lectureId as any,
            order: index + 1,
          },
        });
      })
    );

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function updateLessonOrder(params: UpdateLessonOrderProps) {
  try {
    connectToDatabase();

    await Promise.all(
      params.lessons.map(async (item, index) => {
        return LessonModel.findOneAndUpdate(
          {
            slug: item.slug,
          },
          {
            order: index + 1,
          }
        );
      })
    );
    revalidatePath(params.path);
  } catch (error) {}
}

export async function updateLectureLessonOrder(params: {
  lectures: any[];
  path: string;
}) {
  try {
    connectToDatabase();

    await Promise.all(
      params.lectures.map(async (item, index) => {
        await LectureModel.findOneAndUpdate(
          {
            _id: item._id,
          },
          {
            lessons: item.lessons,
          }
        );
        await updateLessonOrder({
          lessons: item.lessons,
          path: params.path,
        });
      })
    );
    revalidatePath(params.path);
  } catch (error) {}
}
