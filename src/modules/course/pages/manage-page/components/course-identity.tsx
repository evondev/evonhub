import { ToneBadge } from "@/shared/components/common";
import Link from "next/link";
import { CourseManageRow } from "../../../types/course-manage.types";
import { buildCourseContentHref } from "../../../utils/course-manage.utils";
import { CourseThumbnail } from "./course-thumbnail";

interface CourseIdentityProps {
  course: CourseManageRow;
}

/**
 * Ảnh bìa và tên khoá (link sang trang soạn nội dung). Trong bảng tên một dòng,
 * cắt "…"; dưới sm tên dài được hai dòng vì chỉ còn ~200px
 */
export function CourseIdentity({ course }: CourseIdentityProps) {
  return (
    <div className="flex min-w-0 items-start gap-3 sm:items-center">
      <CourseThumbnail image={course.image} title={course.title} />
      <Link
        href={buildCourseContentHref(course)}
        title={course.title}
        className="min-w-0 text-sm font-medium text-foreground underline-offset-4 line-clamp-2 hover:underline sm:truncate"
      >
        {course.title}
      </Link>
      {course.isVideo && (
        <ToneBadge tone="neutral" label="Video" className="shrink-0 py-0.5" />
      )}
      {course.isComingSoon && (
        <ToneBadge
          tone="warning"
          label="Sắp ra mắt"
          className="shrink-0 py-0.5"
        />
      )}
    </div>
  );
}
