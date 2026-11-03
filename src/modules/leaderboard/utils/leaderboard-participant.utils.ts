import { UserRole } from "@/shared/constants/user.constants";

const NON_PARTICIPANT_ROLES: string[] = [UserRole.Admin, UserRole.Expert];

/** Admin, expert mở được mọi khoá nên không lên bảng, không được ghi phút học */
export function isLeaderboardParticipant(role?: string): boolean {
  return Boolean(role) && !NON_PARTICIPANT_ROLES.includes(role as string);
}
