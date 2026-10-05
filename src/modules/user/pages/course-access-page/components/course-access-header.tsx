import { Button } from "@/components/ui/button";
import { ToneBadge } from "@/shared/components/common";
import { CommentAvatar } from "@/shared/features/comment/comment-avatar";
import { Plus } from "lucide-react";
import Link from "next/link";
import { USER_ROLE_LABELS } from "../../../constants/user-manage.constants";
import { CourseAccessUser } from "../../../types/course-access.types";
import { formatCourseAccessDate } from "../../../utils/course-access.utils";

interface CourseAccessHeaderProps {
  user: CourseAccessUser;
  onGrantClick: () => void;
}

/** Đầu trang: đúng người chưa (ảnh, tên, email) và nút cấp khóa */
export function CourseAccessHeader({
  user,
  onGrantClick,
}: CourseAccessHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        {/* Chỉ ghi cấp cha, tên thành viên là h1 ngay dưới */}
        <nav aria-label="Đường dẫn">
          <ol className="flex items-center gap-2 text-sm text-muted">
            <li>
              <Link
                href="/admin/user/manage"
                className="inline-flex h-8 items-center transition-colors hover:text-foreground"
              >
                Quản lý thành viên
              </Link>
            </li>
          </ol>
        </nav>
        <div className="mt-1 flex min-w-0 items-center gap-3">
          <CommentAvatar
            name={user.name}
            avatar={user.avatar}
            className="size-12 text-sm ring-1 ring-border-strong"
          />
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <h1 className="min-w-0 text-balance text-lg font-semibold text-foreground">
                {user.name}
              </h1>
              {user.isLocked && (
                <ToneBadge
                  tone="error"
                  label="Bị khoá"
                  className="shrink-0 py-0.5"
                />
              )}
            </div>
            {/* Dưới sm chia hai dòng theo nghĩa: liên hệ / vai trò và ngày tham gia */}
            <p className="mt-0.5 text-sm text-muted">
              <span className="block sm:inline">
                <span className="break-words">{user.email}</span>
                {" · "}
                <span className="whitespace-nowrap">@{user.username}</span>
              </span>
              <span aria-hidden className="hidden sm:inline">
                {" · "}
              </span>
              <span className="block sm:inline">
                {USER_ROLE_LABELS[user.role]}
                {" · "}
                <span className="whitespace-nowrap">
                  Tham gia {formatCourseAccessDate(user.createdAt)}
                </span>
              </span>
            </p>
          </div>
        </div>
      </div>
      <Button
        type="button"
        variant="primary"
        onClick={onGrantClick}
        className="h-11 w-fit shrink-0 md:h-10"
      >
        <Plus className="size-4 shrink-0" />
        Cấp khóa học
      </Button>
    </header>
  );
}
