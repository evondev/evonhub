"use server";

import CourseModel from "@/modules/course/models";
import LectureModel from "@/modules/lecture/models";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import {
  LessonDetailsOutlineData,
  LessonItemCutomizeData,
  LessonItemData,
} from "@/shared/types";
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
        select: "_id title slug user course order duration",
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
    return JSON.parse(JSON.stringify(lectureList));
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
