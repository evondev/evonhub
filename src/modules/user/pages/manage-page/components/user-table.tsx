import { cn } from "@/shared/utils";
import {
  UserManageFilters,
  UserManageResult,
  UserManageRow,
} from "../../../types/user-manage.types";
import { UserListItem } from "./user-list-item";
import { UserTableEmpty } from "./user-table-empty";
import { UserTableHead } from "./user-table-head";
import { UserTablePagination } from "./user-table-pagination";
import { UserTableRow } from "./user-table-row";

interface UserTableProps {
  id: string;
  result: UserManageResult;
  filters: UserManageFilters;
  pageSize: number;
  /** Đang tải trang hoặc bộ lọc mới, vẫn giữ dòng cũ trên màn */
  isRefreshing: boolean;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
  onToggleStatus: (user: UserManageRow) => void;
}

/** Từ sm là bảng; dưới sm mỗi thành viên một dòng */
export function UserTable({
  id,
  result,
  filters,
  pageSize,
  isRefreshing,
  onPageChange,
  onClearFilters,
  onToggleStatus,
}: UserTableProps) {
  const hasUsers = result.users.length > 0;
  const bodyClassName = cn("transition-opacity", isRefreshing && "opacity-60");

  return (
    <section
      id={id}
      aria-label="Danh sách thành viên"
      aria-busy={isRefreshing}
      className="overflow-hidden rounded-2xl border border-border bg-surface"
    >
      <table className="hidden w-full text-sm sm:table">
        <UserTableHead />
        <tbody className={bodyClassName}>
          {result.users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              onToggleStatus={onToggleStatus}
            />
          ))}
          {!hasUsers && (
            <tr>
              <td colSpan={5}>
                <UserTableEmpty
                  filters={filters}
                  onClearFilters={onClearFilters}
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="sm:hidden">
        {hasUsers && (
          <ul className={bodyClassName}>
            {result.users.map((user) => (
              <UserListItem
                key={user.id}
                user={user}
                onToggleStatus={onToggleStatus}
              />
            ))}
          </ul>
        )}
        {!hasUsers && (
          <UserTableEmpty filters={filters} onClearFilters={onClearFilters} />
        )}
      </div>
      {hasUsers && (
        <UserTablePagination
          page={filters.page}
          pageSize={pageSize}
          total={result.total}
          onPageChange={onPageChange}
        />
      )}
    </section>
  );
}
