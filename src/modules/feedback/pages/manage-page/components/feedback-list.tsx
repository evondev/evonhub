import { TablePagination } from "@/shared/components/common";
import { cn } from "@/shared/utils";
import {
  FeedbackManageFilters,
  FeedbackManageResult,
  FeedbackRow,
} from "../../../types";
import { FeedbackListEmpty } from "./feedback-list-empty";
import { FeedbackListItem } from "./feedback-list-item";

interface FeedbackListProps {
  result: FeedbackManageResult;
  filters: FeedbackManageFilters;
  pageSize: number;
  /** Đang tải trang hoặc từ khoá mới, vẫn giữ dòng cũ trên màn */
  isRefreshing: boolean;
  onPageChange: (page: number) => void;
  onClearSearch: () => void;
  onDelete: (feedback: FeedbackRow) => void;
}

export function FeedbackList({
  result,
  filters,
  pageSize,
  isRefreshing,
  onPageChange,
  onClearSearch,
  onDelete,
}: FeedbackListProps) {
  const hasFeedbacks = result.feedbacks.length > 0;

  return (
    <section
      aria-label="Danh sách góp ý"
      aria-busy={isRefreshing}
      className="overflow-hidden rounded-2xl border border-border bg-surface"
    >
      {hasFeedbacks && (
        <ul className={cn("transition-opacity", isRefreshing && "opacity-60")}>
          {result.feedbacks.map((feedback) => (
            <FeedbackListItem
              key={feedback.id}
              feedback={feedback}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
      {!hasFeedbacks && (
        <FeedbackListEmpty
          search={filters.search}
          onClearSearch={onClearSearch}
        />
      )}
      {hasFeedbacks && (
        <TablePagination
          page={filters.page}
          pageSize={pageSize}
          total={result.total}
          itemLabel="góp ý"
          onPageChange={onPageChange}
        />
      )}
    </section>
  );
}
