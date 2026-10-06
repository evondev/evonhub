import { UserRole } from "@/shared/constants/user.constants";
import { chatRoleLabels } from "../constants";
import { ChatOnlineGroups, ChatSender } from "../types";

/** Chữ trên huy hiệu cạnh tên; học viên trả rỗng là không hiện huy hiệu */
export function getChatRoleLabel(role?: UserRole): string {
  if (!role) return "";

  return chatRoleLabels[role] || "";
}

/** Tách người online thành giảng viên, admin và học viên, giữ thứ tự sẵn có */
export function groupOnlineMembers(members: ChatSender[]): ChatOnlineGroups {
  const staffMembers = members.filter((member) =>
    Boolean(getChatRoleLabel(member.role)),
  );
  const learnerMembers = members.filter(
    (member) => !getChatRoleLabel(member.role),
  );

  return { staffMembers, learnerMembers };
}
