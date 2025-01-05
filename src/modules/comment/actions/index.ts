"use server";

import CourseModel from "@/modules/course/models";
import LessonModel from "@/modules/lesson/models";
import UserModel from "@/modules/user/models";
import { connectToDatabase } from "@/shared/libs";
import { FilterQuery } from "mongoose";
import CommentModel from "../models";
import { CommentItemData } from "../types";

export async function fetchLessonBySlug(slug: string, course?: string) {
  try {
    connectToDatabase();
    const query: FilterQuery<typeof LessonModel> = {
      slug,
      _destroy: false,
    };
    const findCourse = await CourseModel.findOne({ slug: course });
    if (findCourse) query.courseId = findCourse._id.toString();
    const lesson = await LessonModel.findOne(query)
      .select("title content video courseId lectureId iframe")
      .populate({
        path: "courseId",
        model: CourseModel,
        select: "id slug",
      });
    return lesson;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchCommentsByLesson(
  lessonId: string
): Promise<CommentItemData[] | undefined> {
  try {
    connectToDatabase();
    const comments = await CommentModel.find<CommentItemData>({
      lesson: lessonId,
    }).populate({
      path: "user",
      model: UserModel,
      select: "name avatar",
    });

    return JSON.parse(JSON.stringify(comments));
  } catch (error) {
    console.log(error);
  }
}
