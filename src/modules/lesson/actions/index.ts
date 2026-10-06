"use server";

import CourseModel from "@/modules/course/models";
import LectureModel from "@/modules/lecture/models";
import { parseData, sanitizeHtml } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import {
  canAccessCourseContent,
  getCurrentCourseManager,
} from "@/shared/libs/auth";
import {
  LessonDetailsOutlineData,
  LessonItemCutomizeData,
  LessonItemData,
  LessonModelProps,
  UpdateLessonOrderProps,
  UpdateLessonProps,
} from "@/shared/types";
import { Types } from "mongoose";
import { revalidatePath } from "next/cache";
import LessonModel from "../models";

export async function getLessonById(
  lessonId: string
): Promise<LessonItemCutomizeData | undefined> {
  try {
    await connectToDatabase();
    const isValidId = Types.ObjectId.isValid(lessonId);
    if (!isValidId) {
      return;
    }
    const foundLesson = await LessonModel.findById(lessonId).populate({
      path: "courseId",
      model: CourseModel,
      select: "id slug",
    });
    if (!foundLesson) {
      return;
    }

    const lessonDetails: LessonItemCutomizeData = parseData(foundLesson);
    const canReadContent =
      lessonDetails.trial === true ||
      (await canAccessCourseContent(lessonDetails.courseId?._id?.toString()));

    if (canReadContent) return lessonDetails;

    // Chưa mua: vẫn trả khung bài (tiêu đề, khóa) để trang hiện lời mời mua,
    // nhưng bỏ hết phần nội dung trả phí
    const {
      video: _video,
      iframe: _iframe,
      content: _content,
      assetId: _assetId,
      ...lessonOutline
    } = lessonDetails;

    return lessonOutline as LessonItemCutomizeData;
  } catch (error) {
    console.log(error);
  }
}
export async function getLessonPreview(
  lessonId: string
): Promise<LessonItemCutomizeData | undefined> {
  try {
    await connectToDatabase();
    const isValidId = Types.ObjectId.isValid(lessonId);
    if (!isValidId) {
      return;
    }
    const foundLesson = await LessonModel.findById(lessonId).select("trial");
    if (!foundLesson) {
      return;
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
    await connectToDatabase();
    const foundCourse = await CourseModel.findOne({ slug }).select("_id");
    if (!foundCourse) return [];
    const lectureList = await LectureModel.find({
      courseId: foundCourse._id,
      _destroy: false,
    })
      .select("title lessons")
      .sort({ order: 1 })
      // Không populate courseId (mọi chương cùng một khóa) hay lectureId của bài
      // (chính là chương cha): 4 trang đọc mục lục này đều không dùng tới
      .populate({
        path: "lessons",
        model: LessonModel,
        select: "_id title slug order duration trial",
        match: { _destroy: false },
        options: {
          sort: { order: 1 },
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
    await connectToDatabase();
    // Chỉ dùng để đếm và tìm bài trước/sau: không trả video, nội dung trả phí
    const lessons = await LessonModel.find({ courseId }).select(
      "_id title slug order duration trial lectureId courseId",
    );
    if (!lessons) return [];
    return JSON.parse(JSON.stringify(lessons));
  } catch (error) {}
}

// Field bài học người quản lý khóa được sửa từ trình soạn bài
const editableLessonFields: (keyof LessonModelProps)[] = [
  "title",
  "slug",
  "content",
  "video",
  "assetId",
  "iframe",
  "duration",
  "trial",
  "order",
];

interface LectureLessonOrderItem {
  _id: string;
  lessons: { _id: string }[];
}

interface UpdateLectureLessonOrderProps {
  lectures: LectureLessonOrderItem[];
  path: string;
}

/**
 * Khóa chung của các bài/chương truyền lên. Khác khóa nhau hoặc thiếu bản ghi
 * thì trả rỗng để action từ chối cả lô.
 */
function getSingleCourseId(records: { courseId?: unknown }[], total: number) {
  const courseIds = new Set(
    records.map((record) => record.courseId?.toString() || ""),
  );

  if (records.length !== total || courseIds.size !== 1) return "";

  return Array.from(courseIds)[0];
}

export async function updateLesson({
  lessonId,
  data,
  path,
}: UpdateLessonProps) {
  try {
    await connectToDatabase();
    if (!Types.ObjectId.isValid(lessonId)) return;

    const lesson = await LessonModel.findById(lessonId).select("courseId");

    if (!lesson) return;

    const lessonCourseId = lesson.courseId?.toString();
    const courseManager = await getCurrentCourseManager(lessonCourseId);

    if (!courseManager) {
      return {
        type: "error",
        message: "Bạn không có quyền thực hiện thao tác này",
      };
    }

    const lessonUpdate: Record<string, unknown> = {};

    editableLessonFields.forEach((field) => {
      if (data?.[field] !== undefined) lessonUpdate[field] = data[field];
    });

    if (typeof lessonUpdate.content === "string") {
      lessonUpdate.content = sanitizeHtml(lessonUpdate.content);
    }

    if (data?.lectureId) {
      // Chỉ cho chuyển bài sang chương của cùng khóa
      const isSameCourseLecture = await LectureModel.exists({
        _id: data.lectureId,
        courseId: lessonCourseId,
      });

      if (!isSameCourseLecture) return;

      lessonUpdate.lectureId = data.lectureId;
    }

    if (lessonUpdate.slug) {
      const isSlugTaken = await LessonModel.exists({
        slug: lessonUpdate.slug,
        courseId: lessonCourseId,
        _id: { $ne: lessonId },
      });

      if (isSlugTaken) {
        return {
          type: "error",
          message: "Đường dẫn bài học đã tồn tại!",
        };
      }
    }

    await LessonModel.findByIdAndUpdate(lessonId, lessonUpdate);

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function updateLessonOrder(params: UpdateLessonOrderProps) {
  try {
    await connectToDatabase();

    const lessonIds = params.lessons.map((lesson) => lesson._id);
    const lessons = await LessonModel.find({ _id: { $in: lessonIds } }).select(
      "courseId",
    );
    const courseId = getSingleCourseId(lessons, new Set(lessonIds).size);
    const courseManager = await getCurrentCourseManager(courseId);

    if (!courseManager) return;

    // Một bulkWrite thay vì mỗi bài một updateOne
    if (lessonIds.length > 0) {
      await LessonModel.bulkWrite(
        lessonIds.map((lessonId, index) => ({
          updateOne: {
            filter: { _id: lessonId, courseId },
            update: { $set: { order: index + 1 } },
          },
        })),
        { ordered: false },
      );
    }

    revalidatePath(params.path);
  } catch (error) {}
}

export async function updateLectureLessonOrder(
  params: UpdateLectureLessonOrderProps,
) {
  try {
    await connectToDatabase();

    const lectureIds = params.lectures.map((lecture) => lecture._id);
    const lessonIds = params.lectures.flatMap((lecture) =>
      lecture.lessons.map((lesson) => lesson._id),
    );
    const [lectures, lessons] = await Promise.all([
      LectureModel.find({ _id: { $in: lectureIds } }).select("courseId"),
      LessonModel.find({ _id: { $in: lessonIds } }).select("courseId"),
    ]);
    const courseId = getSingleCourseId(lectures, new Set(lectureIds).size);
    const lessonCourseId = getSingleCourseId(lessons, new Set(lessonIds).size);

    // Bài và chương đều phải thuộc đúng một khóa người gọi quản lý
    if (lessonIds.length > 0 && lessonCourseId !== courseId) return;

    const courseManager = await getCurrentCourseManager(courseId);

    if (!courseManager) return;

    // Hai bulkWrite (chương, bài) thay vì mỗi chương, mỗi bài một updateOne
    const lectureUpdates = params.lectures.map((lecture) => ({
      updateOne: {
        filter: { _id: lecture._id, courseId },
        update: {
          $set: { lessons: lecture.lessons.map((lesson) => lesson._id) },
        },
      },
    }));
    const lessonUpdates = params.lectures.flatMap((lecture) =>
      lecture.lessons.map((lesson, index) => ({
        updateOne: {
          filter: { _id: lesson._id, courseId },
          update: { $set: { order: index + 1, lectureId: lecture._id } },
        },
      })),
    );

    await Promise.all([
      lectureUpdates.length > 0 &&
        LectureModel.bulkWrite(lectureUpdates, { ordered: false }),
      lessonUpdates.length > 0 &&
        LessonModel.bulkWrite(lessonUpdates, { ordered: false }),
    ]);
    revalidatePath(params.path);
  } catch (error) {}
}
