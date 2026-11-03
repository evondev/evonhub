import "server-only";

import CourseModel from "@/modules/course/models";
import { isCourseFree } from "@/modules/course/utils";
import { CourseStatus } from "@/shared/constants/course.constants";
import { connectToDatabase } from "@/shared/libs/mongoose";
import { isValidObjectId } from "mongoose";

interface RatingAccessUser {
  courses?: unknown[];
}

interface CourseFreeFields {
  price?: number;
  free?: boolean;
}

/**
 * User được gửi đánh giá cho khóa (hoặc video lẻ) này không: đã mua, hoặc nội
 * dung miễn phí đang bán, vì miễn phí thì xem thẳng chứ không ai "mua".
 * Chưa xét đã đánh giá hay chưa.
 */
export async function hasRatingAccess(
  user: RatingAccessUser,
  courseId: string,
): Promise<boolean> {
  if (!isValidObjectId(courseId)) return false;

  const ownedCourseIds = (user.courses || []).map(String);

  if (ownedCourseIds.includes(courseId)) return true;

  await connectToDatabase();

  const course = await CourseModel.findOne({
    _id: courseId,
    status: CourseStatus.Approved,
    _destroy: false,
  })
    .select("price free")
    .lean<CourseFreeFields>();

  return Boolean(course) && isCourseFree(course || {});
}
