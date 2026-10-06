import { UserRole } from "@/shared/constants/user.constants";

/** Huy hiệu cạnh tên người gửi. Học viên không có huy hiệu */
export const chatRoleLabels: Partial<Record<UserRole, string>> = {
  [UserRole.Admin]: "Admin",
  [UserRole.Expert]: "Giảng viên",
};
