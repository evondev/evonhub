import { UserRole } from "@/shared/constants/user.constants";

/** Huy hiệu cạnh tên người gửi. Học viên không có huy hiệu */
export const chatRoleLabels: Partial<Record<UserRole, string>> = {
  [UserRole.Admin]: "Admin",
  [UserRole.Expert]: "Giảng viên",
};

/**
 * Có người thuộc nhóm này trong phòng thì góc dưới màn hình hiện bong bóng mời
 * vào chat. Muốn thêm giảng viên thì thêm UserRole.Expert vào đây
 */
export const CHAT_HOST_ROLES: string[] = [UserRole.Admin];
