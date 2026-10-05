import { USER_ROLE_LABELS } from "../../../constants/user-manage.constants";
import { UserManageRow } from "../../../types/user-manage.types";
import { UserIdentity } from "./user-identity";
import { UserRowMenu } from "./user-row-menu";

interface UserListItemProps {
  user: UserManageRow;
  onToggleStatus: (user: UserManageRow) => void;
}

/** Một thành viên ở màn hẹp: bảng thành dòng, vai trò và số khoá ở hàng dưới */
export function UserListItem({ user, onToggleStatus }: UserListItemProps) {
  return (
    <li className="flex items-start gap-2 border-b border-border px-4 py-3 last:border-0">
      <div className="min-w-0 flex-1">
        <UserIdentity user={user} />
        {/* pl-12: thẳng mép chữ tên (avatar 36px + gap 12px) */}
        <p className="mt-1.5 pl-12 text-xs tabular-nums text-muted">
          {USER_ROLE_LABELS[user.role]} · {user.courseCount} khoá đã mua
        </p>
      </div>
      <UserRowMenu user={user} onToggleStatus={onToggleStatus} />
    </li>
  );
}
