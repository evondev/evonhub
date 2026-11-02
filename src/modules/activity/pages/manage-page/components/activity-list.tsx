import { TablePagination } from "@/shared/components/common";
import { cn } from "@/shared/utils";
import { ActivityManageFilters, ActivityManageResult } from "../../../types";
import { ActivityListEmpty } from "./activity-list-empty";
import { ActivityListItem } from "./activity-list-item";

interface ActivityListProps {
  id: string;
  result: ActivityManageResult;
  filters: ActivityManageFilters;
  pageSize: number;
  /** Đang tải trang hoặc bộ lọc mới, vẫn giữ dòng cũ trên màn */
  isRefreshing: boolean;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
  onSelectUser: (email: string) => void;
}

export function ActivityList({
  id,
  result,
  filters,
  pageSize,
  isRefreshing,
  onPageChange,
  onClearFilters,
  onSelectUser,
}: ActivityListProps) {
  const hasActivities = result.activities.length > 0;

  return (
    <section
      id={id}
      aria-label="Nhật ký hoạt động"
      aria-busy={isRefreshing}
      className="overflow-hidden rounded-2xl border border-border bg-surface"
    >
      {hasActivities && (
        <ul
          className={cn("transition-opacity", isRefreshing && "opacity-60")}
        >
          {result.activities.map((activity) => (
            <ActivityListItem
              key={activity.id}
              activity={activity}
              onSelectUser={onSelectUser}
            />
          ))}
        </ul>
      )}
      {!hasActivities && (
        <ActivityListEmpty filters={filters} onClearFilters={onClearFilters} />
      )}
      {hasActivities && (
        <TablePagination
          page={filters.page}
          pageSize={pageSize}
          total={result.total}
          itemLabel="hoạt động"
          onPageChange={onPageChange}
        />
      )}
    </section>
  );
}
