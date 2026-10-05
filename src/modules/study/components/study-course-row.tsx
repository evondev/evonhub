"use client";

import { useResumeLessonUrl } from "@/shared/hooks";
import { cn } from "@/shared/utils";
import Link from "next/link";
import { StudyCourse } from "../types";
import { StudyCourseRowContent } from "./study-course-row-content";

interface StudyCourseRowProps {
  studyCourse: StudyCourse;
  isSelected: boolean;
  /** Link chọn khóa để xem đề cương ở panel bên phải (từ lg) */
  selectHref: string;
}

export function StudyCourseRow({
  studyCourse,
  isSelected,
  selectHref,
}: StudyCourseRowProps) {
  // Dưới lg không có panel đề cương: bấm dòng là vào học luôn
  const resumeUrl = useResumeLessonUrl(
    studyCourse.course.slug,
    studyCourse.firstLesson,
  );
  const rowClassName =
    "min-w-0 items-center gap-3 rounded-xl p-2.5 outline-none transition-colors";

  return (
    <li>
      <Link
        href={selectHref}
        scroll={false}
        aria-current={isSelected ? "true" : undefined}
        className={cn(
          "hidden lg:flex",
          rowClassName,
          isSelected && "bg-item-active",
          !isSelected && "hover:bg-item-hover",
        )}
      >
        <StudyCourseRowContent studyCourse={studyCourse} />
      </Link>
      <Link
        href={resumeUrl}
        className={cn("flex hover:bg-item-hover lg:hidden", rowClassName)}
      >
        <StudyCourseRowContent studyCourse={studyCourse} />
      </Link>
    </li>
  );
}
