import CourseModel from "@/modules/course/models";
import { canManageCourse } from "@/modules/course/services/course-permission.service";
import UserModel from "@/modules/user/models";
import { UserRole } from "@/shared/constants/user.constants";
import { connectToDatabase } from "@/shared/libs/mongoose";
import { auth } from "@clerk/nextjs/server";
import { isValidObjectId } from "mongoose";
import { cache } from "react";

/**
 * Lấy user đang đăng nhập từ Clerk session.
 * Mọi server action thao tác dữ liệu của user phải dùng hàm này thay vì nhận
 * userId / userRole từ client.
 */
// cache(): layout, page và các action trong cùng một request dùng chung một lần đọc
export const getCurrentUser = cache(async () => {
  const { userId: clerkId } = auth();

  if (!clerkId) return null;

  await connectToDatabase();

  return UserModel.findOne({ clerkId });
});

/** User đang đăng nhập nếu là admin, không thì null */
export async function getCurrentAdmin() {
  const currentUser = await getCurrentUser();

  if (currentUser?.role !== UserRole.Admin) return null;

  return currentUser;
}

/** User đang đăng nhập nếu là admin hoặc expert, không thì null */
export async function getCurrentStaff() {
  const currentUser = await getCurrentUser();
  const staffRoles: string[] = [UserRole.Admin, UserRole.Expert];

  if (!currentUser || !staffRoles.includes(currentUser.role)) return null;

  return currentUser;
}

/**
 * User đang đăng nhập nếu quản lý được khóa này (admin mọi khóa, expert khóa của mình),
 * không thì null
 */
export async function getCurrentCourseManager(courseId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser || !courseId) return null;

  const canManage = await canManageCourse({
    role: currentUser.role,
    userId: currentUser._id,
    courseId: courseId.toString(),
  });

  return canManage ? currentUser : null;
}

/** Đã mua khóa (có trong user.courses) hoặc quản lý được khóa đó */
export async function canAccessCourseContent(courseId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser || !courseId) return false;

  const ownedCourseIds: string[] = (currentUser.courses || []).map(
    (ownedCourseId: unknown) => String(ownedCourseId),
  );

  if (ownedCourseIds.includes(courseId.toString())) return true;

  return canManageCourse({
    role: currentUser.role,
    userId: currentUser._id,
    courseId: courseId.toString(),
  });
}

interface ManageableCourseStaff {
  _id: unknown;
  role: string;
}

/**
 * Khoá mà người quản lý được xem (bình luận, đánh giá…), đã áp bộ lọc khoá học:
 * admin mọi khoá, expert khoá mình đứng tên. `undefined` là không giới hạn
 * (admin, không lọc khoá).
 */
export async function findManageableCourseIds(
  currentStaff: ManageableCourseStaff,
  courseId?: string,
): Promise<unknown[] | undefined> {
  const hasCourseFilter = typeof courseId === "string" && courseId !== "";

  if (hasCourseFilter && !isValidObjectId(courseId)) return [];

  if (currentStaff.role === UserRole.Admin) {
    return hasCourseFilter ? [courseId] : undefined;
  }

  const ownCourseIds: unknown[] = await CourseModel.find({
    author: currentStaff._id,
  }).distinct("_id");

  if (!hasCourseFilter) return ownCourseIds;

  return ownCourseIds.filter((ownCourseId) => String(ownCourseId) === courseId);
}
