import { TablePagination, ToneBadge } from "@/shared/components/common";
import {
  ModerationList,
  ModerationListEmpty,
  ModerationListHeader,
  ModerationListItem,
  PurgeRejectedButton,
} from "@/shared/components/moderation";
import { CommentStatus } from "@/shared/constants/comment.constants";
import { ModerationState } from "@/shared/hooks";
import {
  COMMENT_EMPTY_MESSAGES,
  COMMENT_STATUS_BADGES,
  COMMENT_TAB_SCOPE_LABELS,
} from "../../../constants/comment-manage.constants";
import {
  CommentManageFilters,
  CommentManageResult,
  CommentManageRow,
} from "../../../types/comment-manage.types";
import {
  canApproveComment,
  canApproveCommentTab,
  canRejectComment,
  canRejectCommentTab,
} from "../../../utils/comment-manage.utils";
import { CommentContext } from "./comment-context";

interface CommentListProps {
  id: string;
  result: CommentManageResult;
  filters: CommentManageFilters;
  pageSize: number;
  /** Đang tải trang hoặc bộ lọc mới, vẫn giữ dòng cũ trên màn */
  isRefreshing: boolean;
  moderation: ModerationState<CommentManageRow>;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
  /** Mở hộp xác nhận xoá vĩnh viễn mọi bình luận đã từ chối */
  onPurgeRejected: () => void;
}

/** Hàng chọn tất cả, các bình luận, phân trang */
export function CommentList({
  id,
  result,
  filters,
  pageSize,
  isRefreshing,
  moderation,
  onPageChange,
  onClearFilters,
  onPurgeRejected,
}: CommentListProps) {
  const selectedComments = result.comments.filter((comment) =>
    moderation.isSelected(comment.id),
  );
  const pageCommentIds = result.comments.map((comment) => comment.id);
  const isAllMatchingSelected = moderation.isAllMatchingSelected;
  const hasComments = result.comments.length > 0;
  // Tab "Tất cả" trộn ba trạng thái nên mỗi dòng có badge
  const isStatusShown = filters.tab === "all";

  return (
    <ModerationList
      id={id}
      label="Danh sách bình luận"
      isRefreshing={isRefreshing}
      hasItems={hasComments}
      header={
        <ModerationListHeader
          label="Bình luận"
          itemLabel="bình luận"
          scopeLabel={COMMENT_TAB_SCOPE_LABELS[filters.tab]}
          itemCount={result.comments.length}
          totalCount={result.total}
          selectedCount={moderation.getSelectedCount(result.total)}
          isPageFullySelected={
            hasComments && selectedComments.length === result.comments.length
          }
          isAllMatchingSelected={isAllMatchingSelected}
          canApprove={
            isAllMatchingSelected
              ? canApproveCommentTab(filters.tab)
              : selectedComments.some(canApproveComment)
          }
          canReject={
            isAllMatchingSelected
              ? canRejectCommentTab(filters.tab)
              : selectedComments.some(canRejectComment)
          }
          runningAction={moderation.getBulkRunningAction()}
          isDisabled={moderation.isChanging}
          trailing={
            filters.tab === CommentStatus.Rejected &&
            hasComments && <PurgeRejectedButton onClick={onPurgeRejected} />
          }
          onToggleSelectAll={() =>
            moderation.handleToggleSelectAll(pageCommentIds)
          }
          onSelectAllMatching={moderation.handleSelectAllMatching}
          onClearSelection={moderation.handleClearSelection}
          onApprove={() =>
            moderation.handleChangeSelection(result.comments, "approve")
          }
          onReject={() =>
            moderation.handleChangeSelection(result.comments, "reject")
          }
        />
      }
      empty={
        <ModerationListEmpty
          search={filters.search}
          hasCourseFilter={Boolean(filters.courseId)}
          itemLabel="bình luận"
          defaultMessage={COMMENT_EMPTY_MESSAGES[filters.tab]}
          onClearFilters={onClearFilters}
        />
      }
      footer={
        <TablePagination
          page={filters.page}
          pageSize={pageSize}
          total={result.total}
          itemLabel="bình luận"
          onPageChange={onPageChange}
        />
      }
    >
      {result.comments.map((comment) => {
        const statusBadge = COMMENT_STATUS_BADGES[comment.status];

        return (
          <ModerationListItem
            key={comment.id}
            authorName={comment.author.name}
            authorAvatar={comment.author.avatar}
            createdAt={comment.createdAt}
            isPending={comment.status === CommentStatus.Pending}
            content={comment.content}
            meta={
              isStatusShown && (
                <ToneBadge
                  tone={statusBadge.tone}
                  label={statusBadge.label}
                  className="shrink-0 py-0.5"
                />
              )
            }
            context={<CommentContext comment={comment} />}
            isSelected={moderation.isSelected(comment.id)}
            canApprove={canApproveComment(comment)}
            canReject={canRejectComment(comment)}
            runningAction={moderation.getRunningAction(comment.id)}
            isDisabled={moderation.isChanging}
            onToggleSelect={() => moderation.handleToggleSelect(comment.id)}
            onApprove={() =>
              moderation.handleChangeStatus([comment], "approve")
            }
            onReject={() => moderation.handleChangeStatus([comment], "reject")}
          />
        );
      })}
    </ModerationList>
  );
}
