"use client";

import { useUserContext } from "@/components/user-context";
import { ITEMS_PER_PAGE } from "@/shared/constants/common.constants";
import {
  useModeration,
  usePurgeRejected,
  useQueryManagedCourses,
} from "@/shared/hooks";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import {
  RATING_MANAGE_DEFAULT_FILTERS,
  RATING_MANAGE_TAB_VALUES,
} from "../../constants/rating-manage.constants";
import {
  useMutationDeleteRejectedRatings,
  useMutationUpdateMatchingRatings,
  useMutationUpdateRatingsStatus,
  useQueryRatingsManage,
} from "../../services";
import { RatingManageRow } from "../../types/rating-manage.types";
import {
  buildRatingCountSuccessMessage,
  buildRatingPurgeSuccessMessage,
  buildRatingSuccessMessage,
  getRatingStatusForAction,
  getRatingStatusForTab,
  toRatingManageRow,
} from "../../utils/rating-manage.utils";
import { RatingManageView } from "./components";

export interface RatingManagePageProps {}

export function RatingManagePage(_props: RatingManagePageProps) {
  const [filters, setFilters] = useQueryStates({
    search: parseAsString.withDefault(RATING_MANAGE_DEFAULT_FILTERS.search),
    tab: parseAsStringLiteral(RATING_MANAGE_TAB_VALUES).withDefault(
      RATING_MANAGE_DEFAULT_FILTERS.tab,
    ),
    courseId: parseAsString.withDefault(RATING_MANAGE_DEFAULT_FILTERS.courseId),
    page: parseAsInteger.withDefault(RATING_MANAGE_DEFAULT_FILTERS.page),
  });
  const { userInfo } = useUserContext();
  const userId = userInfo?.clerkId;

  const { data, isPending, isPlaceholderData, isFetching, refetch } =
    useQueryRatingsManage({
      userId,
      search: filters.search,
      status: getRatingStatusForTab(filters.tab),
      courseId: filters.courseId,
      page: filters.page,
      limit: ITEMS_PER_PAGE,
    });
  const { data: courses } = useQueryManagedCourses(userId);
  const { mutateAsync: updateRatingsStatusAsync } =
    useMutationUpdateRatingsStatus();
  const { mutateAsync: updateMatchingRatingsAsync } =
    useMutationUpdateMatchingRatings();
  const { mutateAsync: deleteRejectedRatingsAsync } =
    useMutationDeleteRejectedRatings();
  // Thao tác "tất cả" áp đúng phạm vi đang xem: từ khoá và khoá học
  const scope = { search: filters.search, courseId: filters.courseId };

  // fetchRatingsManage trả undefined khi lỗi hoặc không phải admin, expert
  const result = data && {
    ratings: data.ratings.map(toRatingManageRow),
    total: data.total,
    tabCounts: data.tabCounts,
  };

  const moderation = useModeration<RatingManageRow>({
    changeStatus: (ratingIds, action) =>
      updateRatingsStatusAsync({
        ratingIds,
        status: getRatingStatusForAction(action),
      }),
    changeMatchingStatus: (excludedIds, action) =>
      updateMatchingRatingsAsync({
        scope,
        currentStatus: getRatingStatusForTab(filters.tab),
        excludedIds,
        status: getRatingStatusForAction(action),
      }),
    buildSuccessMessage: buildRatingSuccessMessage,
    buildCountSuccessMessage: buildRatingCountSuccessMessage,
  });
  const purge = usePurgeRejected({
    purge: () => deleteRejectedRatingsAsync(scope),
    buildSuccessMessage: buildRatingPurgeSuccessMessage,
  });

  return (
    <RatingManageView
      filters={filters}
      onFiltersChange={setFilters}
      result={result}
      courses={courses || []}
      pageSize={ITEMS_PER_PAGE}
      isLoading={isPending}
      isError={!isPending && !data}
      isRefreshing={isPlaceholderData && isFetching}
      onRetry={refetch}
      moderation={moderation}
      purge={purge}
    />
  );
}
