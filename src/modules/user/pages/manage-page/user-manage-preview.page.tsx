"use client";

import { PreviewStateSwitcher } from "@/shared/components/common";
import { ITEMS_PER_PAGE } from "@/shared/constants/common.constants";
import { UserStatus } from "@/shared/constants/user.constants";
import { useState } from "react";
import { useUserLockFlow } from "../../hooks/use-user-lock-flow";
import {
  PREVIEW_MANAGED_USERS,
  USER_MANAGE_DEFAULT_FILTERS,
  USER_MANAGE_PREVIEW_EMPTY_KEYWORD,
  USER_MANAGE_PREVIEW_STATE_LINKS,
  USER_MANAGE_PREVIEW_SAVE_DELAY_MS,
  USER_MANAGE_PREVIEW_TAB_COUNTS,
} from "../../constants/user-manage.constants";
import {
  UpdateUserStatusResult,
  UserManageFilters,
  UserManagePreviewState,
  UserManageRow,
} from "../../types/user-manage.types";
import {
  countPreviewUserTabs,
  filterPreviewUsers,
} from "../../utils/user-manage.utils";
import { UserManageView } from "./components";

interface UserManagePreviewPageProps {
  state: UserManagePreviewState;
}

/** Trang xem trước "Quản lý thành viên" bằng thành viên giả. Không đọc DB, chỉ mở ở dev */
export function UserManagePreviewPage({ state }: UserManagePreviewPageProps) {
  const [filters, setFilters] = useState<UserManageFilters>({
    ...USER_MANAGE_DEFAULT_FILTERS,
    search: state === "rong" ? USER_MANAGE_PREVIEW_EMPTY_KEYWORD : "",
  });
  const [previewUsers, setPreviewUsers] = useState(PREVIEW_MANAGED_USERS);
  const matchedUsers = filterPreviewUsers(previewUsers, filters);
  const hasNarrowingFilters = Boolean(filters.search) || filters.role !== "all";
  // Không tìm, không lọc vai trò thì giả như đang xem cả danh sách thật
  const tabCounts = hasNarrowingFilters
    ? countPreviewUserTabs(previewUsers, filters)
    : USER_MANAGE_PREVIEW_TAB_COUNTS;

  function handleFiltersChange(changes: Partial<UserManageFilters>) {
    setFilters((currentFilters) => ({ ...currentFilters, ...changes }));
  }

  // Giả lập server: chờ một nhịp rồi đổi trạng thái trên danh sách giả
  async function changePreviewStatus(
    user: UserManageRow,
    status: UserStatus,
  ): Promise<UpdateUserStatusResult> {
    await new Promise((resolve) =>
      setTimeout(resolve, USER_MANAGE_PREVIEW_SAVE_DELAY_MS),
    );

    setPreviewUsers((currentUsers) =>
      currentUsers.map((currentUser) =>
        currentUser.id === user.id ? { ...currentUser, status } : currentUser,
      ),
    );

    return { isSuccess: true };
  }

  const lockFlow = useUserLockFlow({ changeStatus: changePreviewStatus });

  function handleRetry() {}

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <PreviewStateSwitcher
        links={USER_MANAGE_PREVIEW_STATE_LINKS}
        currentState={state}
      />
      <UserManageView
        filters={filters}
        onFiltersChange={handleFiltersChange}
        result={{
          users: matchedUsers.slice(0, ITEMS_PER_PAGE),
          total: tabCounts[filters.tab],
          tabCounts,
        }}
        pageSize={ITEMS_PER_PAGE}
        isLoading={state === "dang-tai"}
        isError={state === "loi"}
        isRefreshing={false}
        onRetry={handleRetry}
        onToggleStatus={lockFlow.handleToggleStatus}
        userPendingLock={lockFlow.userPendingLock}
        isLocking={lockFlow.isLocking}
        onConfirmLock={lockFlow.handleConfirmLock}
        onCancelLock={lockFlow.handleCancelLock}
      />
    </div>
  );
}
