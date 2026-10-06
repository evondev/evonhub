import { cn } from "@/shared/utils";
import { CourseManageRow } from "../../../types/course-manage.types";
import { formatCourseManagePrice } from "../../../utils/course-manage.utils";
import { CourseIdentity } from "./course-identity";
import { CourseRowMenu } from "./course-row-menu";
import { CourseStatusBadge } from "./course-status-badge";

interface CourseListItemProps {
  course: CourseManageRow;
}

/**
 * Một khóa học ở màn hẹp: bảng thành dòng, hàng dưới là trạng thái bên trái,
 * giá bên phải. Học viên, ngày tạo là cột phụ, không hiện ở đây
 */
export function CourseListItem({ course }: CourseListItemProps) {
  return (
    <li className="flex items-start gap-2 border-b border-border px-4 py-3 last:border-0">
      <div className="min-w-0 flex-1">
        <CourseIdentity course={course} />
        {/* pl-[76px]: thẳng mép chữ tên (ảnh 64px + gap 12px) */}
        <div className="mt-2 flex items-center justify-between gap-2 pl-[76px]">
          <CourseStatusBadge status={course.status} />
          <span
            className={cn(
              "whitespace-nowrap text-sm tabular-nums",
              course.isFree && "text-muted",
              !course.isFree && "text-foreground",
            )}
          >
            {formatCourseManagePrice(course)}
          </span>
        </div>
      </div>
      <CourseRowMenu course={course} />
    </li>
  );
}
