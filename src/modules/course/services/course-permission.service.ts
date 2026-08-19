import { UserRole } from "@/shared/constants/user.constants";
import CourseModel from "../models";

export interface CanManageCourseProps {
  role?: UserRole;
  userId?: unknown;
  courseId: string;
}

/**
 * Ai được thao tác trên một khóa học cụ thể: admin làm được với mọi khóa,
 * expert chỉ với khóa do chính mình đứng tác giả.
 */
export async function canManageCourse({
  role,
  userId,
  courseId,
}: CanManageCourseProps): Promise<boolean> {
  if (role === UserRole.Admin) return true;

  if (role !== UserRole.Expert || !userId || !courseId) return false;

  return !!(await CourseModel.exists({ _id: courseId, author: userId }));
}
