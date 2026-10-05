import { TablePagination, ToneBadge } from "@/shared/components/common";
import {
  ModerationList,
  ModerationListEmpty,
  ModerationListHeader,
  ModerationListItem,
  PurgeRejectedButton,
} from "@/shared/components/moderation";
import { RatingStatus } from "@/shared/constants/rating.constants";
import { ModerationState } from "@/shared/hooks";
import {
  RATING_EMPTY_MESSAGES,
  RATING_STATUS_BADGES,
  RATING_TAB_SCOPE_LABELS,
} from "../../../constants/rating-manage.constants";
import {
  RatingManageFilters,
  RatingManageResult,
  RatingManageRow,
} from "../../../types/rating-manage.types";
import {
  canApproveRating,
  canApproveRatingTab,
  canRejectRating,
  canRejectRatingTab,
} from "../../../utils/rating-manage.utils";
import { RatingContext } from "./rating-context";
import { RatingReactionLabel } from "./rating-reaction-label";

interface RatingListProps {
  id: string;
  result: RatingManageResult;
  filters: RatingManageFilters;
  pageSize: number;
  /** Đang tải trang hoặc bộ lọc mới, vẫn giữ dòng cũ trên màn */
  isRefreshing: boolean;
  moderation: ModerationState<RatingManageRow>;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
  /** Mở hộp xác nhận xoá vĩnh viễn mọi đánh giá đã từ chối */
  onPurgeRejected: () => void;
}

/** Hàng chọn tất cả, các đánh giá, phân trang */
export function RatingList({
  id,
  result,
  filters,
  pageSize,
  isRefreshing,
  moderation,
  onPageChange,
  onClearFilters,
  onPurgeRejected,
}: RatingListProps) {
  const selectedRatings = result.ratings.filter((rating) =>
    moderation.isSelected(rating.id),
  );
  const pageRatingIds = result.ratings.map((rating) => rating.id);
  const isAllMatchingSelected = moderation.isAllMatchingSelected;
  const hasRatings = result.ratings.length > 0;
  // Tab "Tất cả" trộn ba trạng thái nên mỗi dòng có badge
  const isStatusShown = filters.tab === "all";

  return (
    <ModerationList
      id={id}
      label="Danh sách đánh giá"
      isRefreshing={isRefreshing}
      hasItems={hasRatings}
      header={
        <ModerationListHeader
          label="Đánh giá"
          itemLabel="đánh giá"
          scopeLabel={RATING_TAB_SCOPE_LABELS[filters.tab]}
          itemCount={result.ratings.length}
          totalCount={result.total}
          selectedCount={moderation.getSelectedCount(result.total)}
          isPageFullySelected={
            hasRatings && selectedRatings.length === result.ratings.length
          }
          isAllMatchingSelected={isAllMatchingSelected}
          canApprove={
            isAllMatchingSelected
              ? canApproveRatingTab(filters.tab)
              : selectedRatings.some(canApproveRating)
          }
          canReject={
            isAllMatchingSelected
              ? canRejectRatingTab(filters.tab)
              : selectedRatings.some(canRejectRating)
          }
          runningAction={moderation.getBulkRunningAction()}
          isDisabled={moderation.isChanging}
          trailing={
            filters.tab === RatingStatus.Rejected &&
            hasRatings && <PurgeRejectedButton onClick={onPurgeRejected} />
          }
          onToggleSelectAll={() =>
            moderation.handleToggleSelectAll(pageRatingIds)
          }
          onSelectAllMatching={moderation.handleSelectAllMatching}
          onClearSelection={moderation.handleClearSelection}
          onApprove={() =>
            moderation.handleChangeSelection(result.ratings, "approve")
          }
          onReject={() =>
            moderation.handleChangeSelection(result.ratings, "reject")
          }
        />
      }
      empty={
        <ModerationListEmpty
          search={filters.search}
          hasCourseFilter={Boolean(filters.courseId)}
          itemLabel="đánh giá"
          defaultMessage={RATING_EMPTY_MESSAGES[filters.tab]}
          onClearFilters={onClearFilters}
        />
      }
      footer={
        <TablePagination
          page={filters.page}
          pageSize={pageSize}
          total={result.total}
          itemLabel="đánh giá"
          onPageChange={onPageChange}
        />
      }
    >
      {result.ratings.map((rating) => {
        const statusBadge = RATING_STATUS_BADGES[rating.status];

        return (
          <ModerationListItem
            key={rating.id}
            authorName={rating.author.name}
            authorAvatar={rating.author.avatar}
            createdAt={rating.createdAt}
            isPending={rating.status === RatingStatus.Inactive}
            content={rating.content}
            emptyContentLabel="Chỉ chấm sao, không viết nhận xét."
            meta={
              isStatusShown && (
                <ToneBadge
                  tone={statusBadge.tone}
                  label={statusBadge.label}
                  className="shrink-0 py-0.5"
                />
              )
            }
            subline={<RatingReactionLabel rating={rating.rating} />}
            context={<RatingContext rating={rating} />}
            isSelected={moderation.isSelected(rating.id)}
            canApprove={canApproveRating(rating)}
            canReject={canRejectRating(rating)}
            runningAction={moderation.getRunningAction(rating.id)}
            isDisabled={moderation.isChanging}
            onToggleSelect={() => moderation.handleToggleSelect(rating.id)}
            onApprove={() => moderation.handleChangeStatus([rating], "approve")}
            onReject={() => moderation.handleChangeStatus([rating], "reject")}
          />
        );
      })}
    </ModerationList>
  );
}
