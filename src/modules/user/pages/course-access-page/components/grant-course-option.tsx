"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ToneBadge } from "@/shared/components/common";
import { CourseCover } from "@/shared/components/course";
import { cn } from "@/shared/utils";
import { CourseAccessCourse } from "../../../types/course-access.types";
import { formatCourseAccessPrice } from "../../../utils/course-access.utils";

interface GrantCourseOptionProps {
  course: CourseAccessCourse;
  isOwned: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: (courseId: string) => void;
}

function getOptionClassName(isOwned: boolean, isSelected: boolean) {
  return cn(
    "flex min-w-0 items-center gap-3 rounded-xl px-3 py-2 transition-colors",
    // Đã chọn và đang rê cùng một nền mờ, như dòng bảng tick checkbox
    !isOwned && "cursor-pointer hover:bg-item-hover",
    isSelected && "bg-item-hover",
    isOwned && "cursor-default",
  );
}

export function GrantCourseOption({
  course,
  isOwned,
  isSelected,
  isDisabled,
  onToggle,
}: GrantCourseOptionProps) {
  const checkboxId = `grant-course-${course.id}`;

  return (
    <li>
      <label htmlFor={checkboxId} className={getOptionClassName(isOwned, isSelected)}>
        <Checkbox
          id={checkboxId}
          checked={isOwned || isSelected}
          disabled={isOwned || isDisabled}
          onCheckedChange={() => onToggle(course.id)}
        />
        <CourseCover
          image={course.image}
          sizes="64px"
          // Dưới sm bỏ ảnh để tên khóa đủ chỗ: checkbox và tên đã đủ nhận ra khóa
          className="aspect-video w-16 shrink-0 rounded-md max-sm:hidden"
        />
        <span className="min-w-0 flex-1">
          <span
            className={cn(
              "line-clamp-2 text-pretty text-sm font-medium",
              !isOwned && "text-foreground",
              isOwned && "text-muted",
            )}
          >
            {course.title}
          </span>
          <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
            {isOwned && <span>Đã có</span>}
            {!isOwned && (
              <span className="whitespace-nowrap tabular-nums">
                {formatCourseAccessPrice(course)}
              </span>
            )}
            {course.isRetired && (
              <ToneBadge tone="neutral" label="Ngừng bán" className="py-0.5" />
            )}
          </span>
        </span>
      </label>
    </li>
  );
}
