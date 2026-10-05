import { TablePagination } from "@/shared/components/common";
import { CommentStatus } from "@/shared/constants/comment.constants";
import { cn } from "@/shared/utils";
import {
  CommentManageFilters,
  CommentManageResult,
  CommentManageRow,
  CommentPendingChange,
} from "../../../types/comment-manage.types";
import { CommentListEmpty } from "./comment-list-empty";
import { CommentListHeader } from "./comment-list-header";
import { CommentListItem } from "./comment-list-item";

interface CommentListProps {
  id: string;
  result: CommentManageResult;
  filters: CommentManageFilters;
  pageSize: number;
  /** Đang tải trang hoặc bộ lọc mới, vẫn giữ dòng cũ trên màn */
  isRefreshing: boolean;
  selectedIds: string[];
  pendingChange: CommentPendingChange | null;
  onToggleSelect: (commentId: string) => void;
  onToggleSelectAll: (pageCommentIds: string[]) => void;
  onClearSelection: () => void;
  onChangeStatus: (comments: CommentManageRow[], status: CommentStatus) => void;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
}

/** Một khối chia đường kẻ: hàng chọn tất cả, các bình luận, phân trang */
export function CommentList({
  id,
  result,
  filters,
  pageSize,
  isRefreshing,
  selectedIds,
  pendingChange,
  onToggleSelect,
  onToggleSelectAll,
  onClearSelection,
  onChangeStatus,
  onPageChange,
  onClearFilters,
}: CommentListProps) {
  const hasComments = result.comments.length > 0;
  const selectedComments = result.comments.filter((comment) =>
    selectedIds.includes(comment.id),
  );
  const pageCommentIds = result.comments.map((comment) => comment.id);

  return (
    <section
      id={id}
      aria-label="Danh sách bình luận"
      aria-busy={isRefreshing}
      // overflow-clip, không overflow-hidden: hidden biến khung thành vùng cuộn,
      // hàng "Đã chọn" bên trong không dính được theo trang
      className="overflow-clip rounded-2xl border border-border bg-surface"
    >
      <CommentListHeader
        pageComments={result.comments}
        selectedComments={selectedComments}
        pendingChange={pendingChange}
        onToggleSelectAll={() => onToggleSelectAll(pageCommentIds)}
        onClearSelection={onClearSelection}
        onChangeStatus={onChangeStatus}
      />
      {hasComments && (
        <ul className={cn("transition-opacity", isRefreshing && "opacity-60")}>
          {result.comments.map((comment) => (
            <CommentListItem
              key={comment.id}
              comment={comment}
              isSelected={selectedIds.includes(comment.id)}
              isStatusShown={filters.tab === "all"}
              pendingChange={pendingChange}
              onToggleSelect={onToggleSelect}
              onChangeStatus={onChangeStatus}
            />
          ))}
        </ul>
      )}
      {!hasComments && (
        <CommentListEmpty filters={filters} onClearFilters={onClearFilters} />
      )}
      {hasComments && (
        <TablePagination
          page={filters.page}
          pageSize={pageSize}
          total={result.total}
          itemLabel="bình luận"
          onPageChange={onPageChange}
        />
      )}
    </section>
  );
}
