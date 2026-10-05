import { ToneBadge } from "@/shared/components/common";
import { CommentAvatar } from "@/shared/features/comment/comment-avatar";
import Link from "next/link";
import { UserManageRow } from "../../../types/user-manage.types";
import {
  buildUserManageHref,
  isLockedUser,
} from "../../../utils/user-manage.utils";

interface UserIdentityProps {
  user: UserManageRow;
}

/** Avatar, tên (link sang trang khoá học của thành viên) trên email */
export function UserIdentity({ user }: UserIdentityProps) {
  const isLocked = isLockedUser(user);

  return (
    <div className="flex min-w-0 items-center gap-3">
      <CommentAvatar
        name={user.name}
        avatar={user.avatar}
        className="size-9 ring-1 ring-border-strong"
      />
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href={buildUserManageHref(user)}
            title={user.name}
            // py-0.5 -my-0.5: chỗ bấm cao 24px mà dòng chữ không giãn ra
            className="-my-0.5 truncate py-0.5 text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            {user.name}
          </Link>
          {isLocked && (
            <ToneBadge
              tone="error"
              label="Bị khoá"
              className="shrink-0 py-0.5"
            />
          )}
        </div>
        <p title={user.email} className="truncate text-xs text-muted">
          {user.email}
        </p>
      </div>
    </div>
  );
}
