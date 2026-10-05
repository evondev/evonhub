"use client";

import { UserRole } from "@/shared/constants/user.constants";
import { ITEMS_PER_PAGE } from "@/shared/constants/common.constants";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import { useUserLockFlow } from "../../hooks/use-user-lock-flow";
import { useMutationUpdateUserStatus } from "../../services/data/mutation-update-user-status.data";
import { useQueryUsers } from "../../services/data/query-users.data";
import {
  getUserManageFetchFilters,
  toUserManageRow,
} from "../../utils/user-manage.utils";
import { UserManageView } from "./components";

export interface UserManagePageProps {}

const userManageTabs = ["all", "paid", "locked"] as const;
const userRoleFilters = [
  "all",
  UserRole.User,
  UserRole.Expert,
  UserRole.Admin,
] as const;

export function UserManagePage(_props: UserManagePageProps) {
  const [filters, setFilters] = useQueryStates({
    search: parseAsString.withDefault(""),
    tab: parseAsStringLiteral(userManageTabs).withDefault("all"),
    role: parseAsStringLiteral(userRoleFilters).withDefault("all"),
    page: parseAsInteger.withDefault(1),
  });
  const fetchFilters = getUserManageFetchFilters(filters);

  const { mutateAsync: updateUserStatusAsync } = useMutationUpdateUserStatus();
  const { data, isPending, isPlaceholderData, isFetching, refetch } =
    useQueryUsers({
      search: filters.search,
      page: filters.page,
      limit: ITEMS_PER_PAGE,
      ...fetchFilters,
    });

  // fetchUsers trả undefined khi lỗi hoặc không phải admin
  const result = data && {
    users: data.users.map(toUserManageRow),
    total: data.total,
    tabCounts: data.tabCounts,
  };

  const lockFlow = useUserLockFlow({
    changeStatus: (user, status) =>
      updateUserStatusAsync({ userId: user.id, status }),
  });

  return (
    <UserManageView
      filters={filters}
      onFiltersChange={setFilters}
      result={result}
      pageSize={ITEMS_PER_PAGE}
      isLoading={isPending}
      isError={!isPending && !data}
      isRefreshing={isPlaceholderData && isFetching}
      onRetry={refetch}
      onToggleStatus={lockFlow.handleToggleStatus}
      userPendingLock={lockFlow.userPendingLock}
      isLocking={lockFlow.isLocking}
      onConfirmLock={lockFlow.handleConfirmLock}
      onCancelLock={lockFlow.handleCancelLock}
    />
  );
}
