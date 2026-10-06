import { formatThoundsand, cn } from "@/shared/utils";
import { CourseManageRow } from "../../../types/course-manage.types";
import { formatCourseManagePrice } from "../../../utils/course-manage.utils";
import { formatShortDate } from "../../../utils";
import { CourseIdentity } from "./course-identity";
import { CourseRowMenu } from "./course-row-menu";
import { CourseStatusBadge } from "./course-status-badge";

interface CourseTableRowProps {
  course: CourseManageRow;
}

export function CourseTableRow({ course }: CourseTableRowProps) {
  return (
    // Dòng không bấm được nên không có nền rê; menu ⋯ đang mở thì dòng tô nhạt
    // để biết menu thuộc dòng nào
    <tr className="border-b border-border last:border-0 has-[[data-state=open]]:bg-foreground/[0.025]">
      {/* w-full max-w-0: cột tên nhận phần dư, tên dài cắt trong ô thay vì đẩy bảng rộng ra */}
      <td className="w-full max-w-0 py-3 pl-5 pr-4">
        <CourseIdentity course={course} />
      </td>
      <td className="w-px whitespace-nowrap px-4 py-3">
        <CourseStatusBadge status={course.status} />
      </td>
      <td
        className={cn(
          "w-px whitespace-nowrap px-4 py-3 text-right tabular-nums",
          course.isFree && "text-muted",
          !course.isFree && "text-foreground",
        )}
      >
        {formatCourseManagePrice(course)}
      </td>
      <td
        className={cn(
          "w-px whitespace-nowrap px-4 py-3 text-right tabular-nums",
          course.studentCount === 0 && "text-muted",
          course.studentCount > 0 && "text-foreground",
        )}
      >
        {formatThoundsand(course.studentCount)}
      </td>
      <td className="hidden w-px whitespace-nowrap px-4 py-3 tabular-nums text-foreground/80 md:table-cell">
        {formatShortDate(course.createdAt)}
      </td>
      <td className="w-px py-3 pl-2 pr-3 text-right">
        <CourseRowMenu course={course} />
      </td>
    </tr>
  );
}
