"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/shared/utils";
import { Check, ChevronDown } from "lucide-react";
import { CommentCourseOption } from "../../../types/comment-manage.types";

interface CommentCourseFilterProps {
  courses: CommentCourseOption[];
  /** Rỗng là mọi khoá */
  value: string;
  onChange: (courseId: string) => void;
  className?: string;
}

const allCoursesOption: CommentCourseOption = {
  id: "",
  title: "Tất cả khoá học",
};

export function CommentCourseFilter({
  courses,
  value,
  onChange,
  className,
}: CommentCourseFilterProps) {
  const options = [allCoursesOption, ...courses];
  const currentCourse = courses.find((course) => course.id === value);

  return (
    // modal={false}: menu mở không khoá cuộn trang, thanh cuộn không ẩn hiện làm giật
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        {/* Cùng trạng thái mở với ô Select: viền màu nhấn + ring-2, nền giữ trắng, không hover */}
        <Button
          variant="outline"
          className={cn(
            "h-11 min-w-0 shrink-0 gap-1.5 whitespace-nowrap px-3 hover:bg-surface data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-primary/15 md:h-10",
            className,
          )}
        >
          {/* Chưa lọc thì nút chỉ ghi "Khoá học"; đang lọc thì ghi tên khoá */}
          {currentCourse && (
            <span
              title={currentCourse.title}
              className="max-w-48 truncate font-medium text-foreground"
            >
              {currentCourse.title}
            </span>
          )}
          {!currentCourse && <span className="text-foreground">Khoá học</span>}
          <ChevronDown className="size-4 shrink-0 text-muted" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="scrollbar-auto-hide flex max-h-80 w-80 flex-col gap-0.5 overflow-y-auto rounded-xl border-border bg-surface p-1 text-foreground shadow-lg dark:border-border dark:bg-surface dark:text-foreground"
      >
        {options.map((option) => {
          const isCurrent = option.id === (currentCourse?.id || "");

          return (
            <DropdownMenuItem
              key={option.id || "all"}
              onSelect={() => onChange(option.id)}
              aria-current={isCurrent ? "true" : undefined}
              className={cn(
                // shrink-0: danh sách dài hơn max-h thì khung cuộn, mục không bị ép thấp lại đè chữ lên nhau
                "flex min-h-9 shrink-0 cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm focus:text-foreground dark:focus:text-foreground",
                isCurrent &&
                  "bg-item-active font-medium text-foreground focus:bg-item-active dark:focus:bg-item-active",
                !isCurrent &&
                  "text-foreground/80 focus:bg-item-hover dark:focus:bg-item-hover",
              )}
            >
              <span className="flex-1 text-pretty">{option.title}</span>
              <Check
                aria-hidden
                className={cn("size-4 shrink-0", !isCurrent && "invisible")}
              />
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
