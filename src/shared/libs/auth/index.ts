import { canManageCourse } from "@/modules/course/services/course-permission.service";
import UserModel from "@/modules/user/models";
import { UserRole } from "@/shared/constants/user.constants";
import { connectToDatabase } from "@/shared/libs";
import { auth } from "@clerk/nextjs/server";

/**
 * Lấy user đang đăng nhập từ Clerk session.
 * Mọi server action thao tác dữ liệu của user phải dùng hàm này thay vì nhận
 * userId / userRole từ client.
 */
export async function getCurrentUser() {
  const { userId: clerkId } = auth();

  if (!clerkId) return null;

  await connectToDatabase();

  return UserModel.findOne({ clerkId });
}

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
