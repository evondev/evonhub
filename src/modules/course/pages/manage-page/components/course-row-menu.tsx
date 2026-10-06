"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLink, ListTree, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";
import { CourseManageRow } from "../../../types/course-manage.types";
import {
  buildCourseContentHref,
  buildCoursePublicHref,
  buildCourseUpdateHref,
} from "../../../utils/course-manage.utils";

interface CourseRowMenuProps {
  course: CourseManageRow;
}

const menuItemClassName =
  "flex h-9 cursor-pointer items-center gap-2 rounded-lg px-2.5 text-sm text-foreground/80 focus:bg-item-hover focus:text-foreground dark:focus:bg-item-hover dark:focus:text-foreground";

export function CourseRowMenu({ course }: CourseRowMenuProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Thao tác với ${course.title}`}
          className="size-9 rounded-lg hover:bg-foreground/[0.08] data-[state=open]:bg-foreground/[0.08] data-[state=open]:text-foreground"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="flex w-56 flex-col gap-1 rounded-xl border-border bg-surface p-1 text-foreground shadow-lg dark:border-border dark:bg-surface dark:text-foreground"
      >
        <DropdownMenuItem asChild className={menuItemClassName}>
          <Link href={buildCourseContentHref(course)}>
            <ListTree className="size-4 text-muted" />
            Soạn nội dung
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className={menuItemClassName}>
          <Link href={buildCourseUpdateHref(course)}>
            <Pencil className="size-4 text-muted" />
            Sửa thông tin
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1 bg-border dark:bg-border" />
        {/* Trang công khai mở tab mới để không rời bảng đang lọc */}
        <DropdownMenuItem asChild className={menuItemClassName}>
          <Link
            href={buildCoursePublicHref(course)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="size-4 text-muted" />
            Xem trang khóa học
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
