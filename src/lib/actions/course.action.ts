"use server";
import { sanitizeHtml } from "@/shared/helpers";
import { ICourse } from "@/database/course.model";
import Lecture from "@/database/lecture.model";
import CourseModel from "@/modules/course/models";
import UserModel from "@/modules/user/models";
import { UserRole } from "@/shared/constants/user.constants";
import { getCurrentCourseManager, getCurrentStaff } from "@/shared/libs/auth";
import {
  CourseParams,
  CreateCourseParams,
  CreateLectureParams,
  UpdateCourseParams,
} from "@/types";
import { ECourseStatus, Role } from "@/types/enums";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";

const permissionDeniedResponse = {
  type: "error",
  message: "Bạn không có quyền thực hiện thao tác này",
};

// Chỉ những field có trên form cập nhật khóa học. author, rating, views,
// lecture, _destroy không bao giờ nhận từ client; status xử lý riêng (chỉ admin).
const editableCourseFields: (keyof ICourse)[] = [
  "title",
  "slug",
  "price",
  "salePrice",
  "desc",
  "content",
  "image",
  "intro",
  "level",
  "category",
  "info",
  "cta",
  "ctaLink",
  "seoKeywords",
  "free",
];

function isCourseStatus(value: unknown): value is ECourseStatus {
  return Object.values(ECourseStatus).includes(value as ECourseStatus);
}

export async function createCourse({ title, slug, path }: CreateCourseParams) {
  try {
    await connectToDatabase();
    const currentStaff = await getCurrentStaff();

    if (!currentStaff) return permissionDeniedResponse;

    const isSlugTaken = await CourseModel.exists({ slug });

    if (isSlugTaken) {
      return {
        type: "error",
        message: "Đường dẫn khóa học đã tồn tại!",
      };
    }

    await CourseModel.create({
      title,
      slug,
      _destroy: false,
      author: currentStaff._id,
      isMicro: true,
    });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
export async function updateCourse({
  slug,
  updateData,
  path,
  courseSlug,
}: UpdateCourseParams) {
  try {
    await connectToDatabase();
    const course = await CourseModel.findOne({ slug: courseSlug }).select(
      "_id slug",
    );

    if (!course) return;

    const courseManager = await getCurrentCourseManager(course._id.toString());

    if (!courseManager) return permissionDeniedResponse;

    const courseUpdate: Record<string, unknown> = {};

    editableCourseFields.forEach((field) => {
      if (updateData?.[field] !== undefined)
        courseUpdate[field] = updateData[field];
    });

    if (typeof courseUpdate.desc === "string") {
      courseUpdate.desc = sanitizeHtml(courseUpdate.desc);
    }

    if (!courseUpdate.slug) delete courseUpdate.slug;

    if (courseUpdate.slug && courseUpdate.slug !== course.slug) {
      const isSlugTaken = await CourseModel.exists({
        slug: courseUpdate.slug,
        _id: { $ne: course._id },
      });

      if (isSlugTaken) {
        return {
          type: "error",
          message: "Đường dẫn này đã tồn tại!",
        };
      }
    }

    if (
      courseManager.role === UserRole.Admin &&
      isCourseStatus(updateData?.status)
    ) {
      courseUpdate.status = updateData.status;
    }

    await CourseModel.findByIdAndUpdate(course._id, courseUpdate, {
      new: true,
    });

    revalidatePath(path || `/admin/course/update?slug=${slug}`);
  } catch (error) {
    console.log("error:", error);
  }
}
export async function getCourseBySlug(
  slug: string,
): Promise<CourseParams | undefined> {
  try {
    await connectToDatabase();
    const course = await CourseModel.findOne({ slug }).select(
      "title info desc level views intro image price salePrice status slug cta ctaLink seoKeywords free author isMicro _destroy",
    );

    if (!course) return;

    const isPublicCourse =
      course.status === ECourseStatus.APPROVED && !course._destroy;

    if (!isPublicCourse) {
      const courseManager = await getCurrentCourseManager(
        course._id.toString(),
      );

      if (!courseManager) return;
    }

    return course;
  } catch (error) {
    console.log("error:", error);
  }
}

export async function deleteCourse(slug: string) {
  try {
    connectToDatabase();
    connectToDatabase();
    const { userId } = auth();
    const findUser = await UserModel.findOne({ clerkId: userId });
    if (![Role.ADMIN].includes(findUser?.role)) return undefined;
    await CourseModel.findOneAndUpdate(
      { slug },
      {
        status: ECourseStatus.PENDING,
      },
    );
    revalidatePath("/admin/course/manage");
  } catch (error) {}
}
export async function updateCourseWithLecture({
  title,
  courseId,
  order,
}: CreateLectureParams) {
  try {
    await connectToDatabase();
    const course = await CourseModel.findById(courseId);

    if (!course) {
      throw new Error("Không tìm thấy khóa học");
    }

    const courseManager = await getCurrentCourseManager(course._id.toString());

    if (!courseManager) return;

    const newLecture = new Lecture({
      title,
      order,
      courseId: course._id,
      _destroy: false,
    });
    await newLecture.save();
    course.lecture.push(newLecture._id);
    await course.save();
    revalidatePath(`/admin/course/content?slug=${course.slug}`);
  } catch (error) {
    console.log(error);
  }
}
