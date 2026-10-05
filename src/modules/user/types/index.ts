import { UserRole, UserStatus } from "@/shared/constants/user.constants";

export interface FetchUsersProps {
  search?: string;
  limit: number;
  page: number;
  isPaid?: boolean;
  status?: UserStatus;
  role?: UserRole;
}
