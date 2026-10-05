"use client";

import { LoadErrorState } from "@/shared/components/common";
import { useRef } from "react";
import { USER_MANAGE_DEFAULT_FILTERS } from "../../../constants/user-manage.constants";
import {
  UserManageFilters,
  UserManageResult,
  UserManageRow,
  UserManageTab,
  UserRoleFilter,
} from "../../../types/user-manage.types";
import { buildUserManageTabs } from "../../../utils/user-manage.utils";
import { UserLockDialog } from "./user-lock-dialog";
import { UserManageToolbar } from "./user-manage-toolbar";
import { UserTable } from "./user-table";
import { UserTableSkeleton } from "./user-table-skeleton";

export interface UserManageViewProps {
  filters: UserManageFilters;
  onFiltersChange: (changes: Partial<UserManageFilters>) => void;
  result?: UserManageResult;
  pageSize: number;
  isLoading: boolean;
  isError: boolean;
  /** Đã có dòng trên màn, đang tải trang/bộ lọc mới */
  isRefreshing: boolean;
  onRetry: () => void;
  onToggleStatus: (user: UserManageRow) => void;
  /** Thành viên đang chờ xác nhận khoá; null là hộp xác nhận đóng */
  userPendingLock: UserManageRow | null;
  isLocking: boolean;
  onConfirmLock: () => void;
  onCancelLock: () => void;
}

const userTableId = "user-manage-table";

export function UserManageView({
  filters,
  onFiltersChange,
  result,
  pageSize,
  isLoading,
  isError,
  isRefreshing,
  onRetry,
  onToggleStatus,
  userPendingLock,
  isLocking,
  onConfirmLock,
  onCancelLock,
}: UserManageViewProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  function handleTabChange(tab: UserManageTab) {
    onFiltersChange({ tab, page: 1 });
  }

  function handleRoleChange(role: UserRoleFilter) {
    onFiltersChange({ role, page: 1 });
  }

  function handleSearch(search: string) {
    if (search === filters.search) return;

    onFiltersChange({ search, page: 1 });
  }

  function handlePageChange(page: number) {
    onFiltersChange({ page });
    window.scrollTo({ top: 0 });
  }

  function handleClearFilters() {
    onFiltersChange(USER_MANAGE_DEFAULT_FILTERS);
    searchInputRef.current?.focus();
  }

  return (
    <div className="flex flex-col gap-4">
      <UserManageToolbar
        filters={filters}
        tabs={buildUserManageTabs(result?.tabCounts)}
        onTabChange={handleTabChange}
        onRoleChange={handleRoleChange}
        onSearch={handleSearch}
        searchInputRef={searchInputRef}
        controlsId={userTableId}
      />
      {isLoading && <UserTableSkeleton />}
      {!isLoading && isError && (
        <LoadErrorState
          title="Chưa tải được danh sách thành viên"
          onRetry={onRetry}
        />
      )}
      {!isLoading && !isError && result && (
        <UserTable
          id={userTableId}
          result={result}
          filters={filters}
          pageSize={pageSize}
          isRefreshing={isRefreshing}
          onPageChange={handlePageChange}
          onClearFilters={handleClearFilters}
          onToggleStatus={onToggleStatus}
        />
      )}
      <UserLockDialog
        user={userPendingLock}
        isLocking={isLocking}
        onConfirm={onConfirmLock}
        onCancel={onCancelLock}
      />
    </div>
  );
}
