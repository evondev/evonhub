"use client";

import {
  addCourseToUser,
  removeCourseFromUser,
} from "@/lib/actions/user.action";
import { toast } from "react-toastify";
import { USER_MANAGE_UPDATE_PATH } from "../../constants/user-manage.constants";
import {
  CourseAccessCourse,
  CourseAccessGrant,
  CourseAccessUser,
} from "../../types/course-access.types";
import { CourseAccessView } from "./components";

export interface UserCourseAccessPageProps {
  user: CourseAccessUser;
  courses: CourseAccessCourse[];
  grants: CourseAccessGrant[];
}

/** Admin cấp, thu hồi khóa học bằng tay cho một thành viên */
export function UserCourseAccessPage({
  user,
  courses,
  grants,
}: UserCourseAccessPageProps) {
  async function handleGrant(selectedCourses: CourseAccessCourse[]) {
    const failedMessages: string[] = [];

    // Cấp lần lượt từng khóa: mỗi khóa một đơn 0 đ, một thông báo như cấp lẻ.
    // Giá đọc ở server, không gửi từ đây
    for (const course of selectedCourses) {
      const grantResult = await addCourseToUser({
        userId: user.clerkId,
        course: { id: course.id },
        path: USER_MANAGE_UPDATE_PATH,
      });

      if (grantResult?.type === "error")
        failedMessages.push(`${course.title}: ${grantResult.message}`);
    }

    const grantedCount = selectedCourses.length - failedMessages.length;

    if (grantedCount > 0) toast.success(`Đã cấp ${grantedCount} khóa học`);
    failedMessages.forEach((failedMessage) => toast.error(failedMessage));

    return grantedCount > 0;
  }

  async function handleRevoke(grant: CourseAccessGrant) {
    const revokeResult = await removeCourseFromUser({
      userId: user.clerkId,
      courseId: grant.course.id,
      path: USER_MANAGE_UPDATE_PATH,
    });

    // Lỗi thì giữ hộp mở để thử lại
    if (revokeResult?.type === "error") {
      toast.error(revokeResult.message);

      return false;
    }

    toast.success("Đã thu hồi khóa học");

    return true;
  }

  return (
    <CourseAccessView
      user={user}
      courses={courses}
      grants={grants}
      onGrant={handleGrant}
      onRevoke={handleRevoke}
    />
  );
}
