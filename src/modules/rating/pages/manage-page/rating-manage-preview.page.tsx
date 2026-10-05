"use client";

import { PreviewStateSwitcher } from "@/shared/components/common";
import { RatingStatus } from "@/shared/constants/rating.constants";
import { ITEMS_PER_PAGE } from "@/shared/constants/common.constants";
import { useModeration, usePurgeRejected } from "@/shared/hooks";
import { ModerationAction, ModerationResult } from "@/shared/types";
import { useState } from "react";
import {
  RATING_MANAGE_DEFAULT_FILTERS,
  RATING_MANAGE_PREVIEW_EMPTY_KEYWORD,
  RATING_MANAGE_PREVIEW_SAVE_DELAY_MS,
  RATING_MANAGE_PREVIEW_STATE_LINKS,
  RATING_MANAGE_PREVIEW_TAB_COUNTS,
  PREVIEW_RATING_COURSES,
  PREVIEW_MANAGED_RATINGS,
} from "../../constants/rating-manage.constants";
import {
  RatingManageFilters,
  RatingManagePreviewState,
  RatingManageRow,
} from "../../types/rating-manage.types";
import {
  buildRatingCountSuccessMessage,
  buildRatingPurgeSuccessMessage,
  buildRatingSuccessMessage,
  countPreviewRatingTabs,
  filterPreviewRatings,
  getRatingStatusForAction,
} from "../../utils/rating-manage.utils";
import { RatingManageView } from "./components";

interface RatingManagePreviewPageProps {
  state: RatingManagePreviewState;
}

const previewCourseTitleById = Object.fromEntries(
  PREVIEW_RATING_COURSES.map((course) => [course.id, course.title]),
);

/** Trang xem trước "Quản lý đánh giá" bằng đánh giá giả. Không đọc DB, chỉ mở ở dev */
export function RatingManagePreviewPage({
  state,
}: RatingManagePreviewPageProps) {
  const [filters, setFilters] = useState<RatingManageFilters>({
    ...RATING_MANAGE_DEFAULT_FILTERS,
    search: state === "rong" ? RATING_MANAGE_PREVIEW_EMPTY_KEYWORD : "",
  });
  // "Hết hàng chờ": mọi đánh giá đã được xử lý
  const [previewRatings, setPreviewRatings] = useState(() =>
    state === "het-cho"
      ? PREVIEW_MANAGED_RATINGS.filter(
          (rating) => rating.status !== RatingStatus.Inactive,
        )
      : PREVIEW_MANAGED_RATINGS,
  );
  const matchedRatings = filterPreviewRatings(
    previewRatings,
    filters,
    previewCourseTitleById,
  );
  const hasNarrowingFilters = Boolean(filters.search || filters.courseId);
  const hasChangedRatings = previewRatings !== PREVIEW_MANAGED_RATINGS;
  // Chưa tìm, chưa lọc, chưa đổi gì thì giả như đang xem cả danh sách thật
  const tabCounts =
    hasNarrowingFilters || hasChangedRatings
      ? countPreviewRatingTabs(previewRatings, filters, previewCourseTitleById)
      : RATING_MANAGE_PREVIEW_TAB_COUNTS;

  function handleFiltersChange(changes: Partial<RatingManageFilters>) {
    setFilters((currentFilters) => ({ ...currentFilters, ...changes }));
  }

  // Giả lập server: chờ một nhịp rồi đổi trạng thái trên danh sách giả
  async function changePreviewStatus(
    ratingIds: string[],
    action: ModerationAction,
  ): Promise<ModerationResult> {
    const status = getRatingStatusForAction(action);

    await new Promise((resolve) =>
      setTimeout(resolve, RATING_MANAGE_PREVIEW_SAVE_DELAY_MS),
    );

    setPreviewRatings((currentRatings) =>
      currentRatings.map((rating) =>
        ratingIds.includes(rating.id) ? { ...rating, status } : rating,
      ),
    );

    return { isSuccess: true };
  }

  // Giả lập "chọn cả bộ lọc": đổi mọi đánh giá giả khớp bộ lọc, trừ mục bỏ tick
  async function changePreviewMatchingStatus(
    excludedIds: string[],
    action: ModerationAction,
  ): Promise<ModerationResult> {
    const matchedIds = matchedRatings
      .map((rating) => rating.id)
      .filter((ratingId) => !excludedIds.includes(ratingId));

    await changePreviewStatus(matchedIds, action);

    return { isSuccess: true, count: matchedIds.length };
  }

  // Giả lập xoá vĩnh viễn: bỏ các đánh giá giả đã từ chối khớp bộ lọc
  async function purgePreviewRejected(): Promise<ModerationResult> {
    const rejectedIds = filterPreviewRatings(
      previewRatings,
      { ...filters, tab: RatingStatus.Rejected },
      previewCourseTitleById,
    ).map((rating) => rating.id);

    await new Promise((resolve) =>
      setTimeout(resolve, RATING_MANAGE_PREVIEW_SAVE_DELAY_MS),
    );

    setPreviewRatings((currentRatings) =>
      currentRatings.filter((rating) => !rejectedIds.includes(rating.id)),
    );

    return { isSuccess: true, count: rejectedIds.length };
  }

  const moderation = useModeration<RatingManageRow>({
    changeStatus: changePreviewStatus,
    changeMatchingStatus: changePreviewMatchingStatus,
    buildSuccessMessage: buildRatingSuccessMessage,
    buildCountSuccessMessage: buildRatingCountSuccessMessage,
  });
  const purge = usePurgeRejected({
    purge: purgePreviewRejected,
    buildSuccessMessage: buildRatingPurgeSuccessMessage,
  });

  function handleRetry() {}

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <PreviewStateSwitcher
        links={RATING_MANAGE_PREVIEW_STATE_LINKS}
        currentState={state}
      />
      <RatingManageView
        filters={filters}
        onFiltersChange={handleFiltersChange}
        result={{
          ratings: matchedRatings.slice(0, ITEMS_PER_PAGE),
          total: tabCounts[filters.tab],
          tabCounts,
        }}
        courses={PREVIEW_RATING_COURSES}
        pageSize={ITEMS_PER_PAGE}
        isLoading={state === "dang-tai"}
        isError={state === "loi"}
        isRefreshing={false}
        onRetry={handleRetry}
        moderation={moderation}
        purge={purge}
      />
    </div>
  );
}
