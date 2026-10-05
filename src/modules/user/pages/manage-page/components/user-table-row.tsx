import { cn } from "@/shared/utils";
import { USER_ROLE_LABELS } from "../../../constants/user-manage.constants";
import { UserManageRow } from "../../../types/user-manage.types";
import {
  formatUserJoinedDate,
  isDefaultRole,
} from "../../../utils/user-manage.utils";
import { UserIdentity } from "./user-identity";
import { UserRowMenu } from "./user-row-menu";

interface UserTableRowProps {
  user: UserManageRow;
  onToggleStatus: (user: UserManageRow) => void;
}

export function UserTableRow({ user, onToggleStatus }: UserTableRowProps) {
  return (
    // Dòng không bấm được nên không có nền rê; menu ⋯ đang mở thì dòng tô nhạt
    // để biết menu thuộc dòng nào
    <tr className="border-b border-border last:border-0 has-[[data-state=open]]:bg-foreground/[0.025]">
      {/* w-full max-w-0: cột tên nhận phần dư, tên dài cắt trong ô thay vì đẩy bảng rộng ra */}
      <td className="w-full max-w-0 py-3 pl-5 pr-4">
        <UserIdentity user={user} />
      </td>
      <td
        className={cn(
          "w-px whitespace-nowrap px-4 py-3",
          isDefaultRole(user.role) && "text-muted",
          !isDefaultRole(user.role) && "text-foreground",
        )}
      >
        {USER_ROLE_LABELS[user.role]}
      </td>
      <td
        className={cn(
          "w-px whitespace-nowrap px-4 py-3 text-right tabular-nums",
          user.courseCount === 0 && "text-muted",
          user.courseCount > 0 && "text-foreground",
        )}
      >
        {user.courseCount}
      </td>
      <td className="hidden w-px whitespace-nowrap px-4 py-3 tabular-nums text-foreground/80 md:table-cell">
        {formatUserJoinedDate(user.createdAt)}
      </td>
      <td className="w-px py-3 pl-2 pr-3 text-right">
        <UserRowMenu user={user} onToggleStatus={onToggleStatus} />
      </td>
    </tr>
  );
}
