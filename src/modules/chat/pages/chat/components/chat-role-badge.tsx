import { UserRole } from "@/shared/constants/user.constants";
import { getChatRoleLabel } from "../../../utils";

interface ChatRoleBadgeProps {
  role?: UserRole;
}

/** Huy hiệu Giảng viên / Admin cạnh tên, để nhận ra câu trả lời đáng tin giữa phòng đông */
export function ChatRoleBadge({ role }: ChatRoleBadgeProps) {
  const label = getChatRoleLabel(role);

  if (!label) return null;

  return (
    <span className="inline-flex h-5 shrink-0 items-center rounded-md bg-primary/10 px-1.5 text-xs font-medium text-primary-strong">
      {label}
    </span>
  );
}
