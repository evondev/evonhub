"use client";

import { useUserContext } from "@/components/user-context";
import { ITEMS_PER_PAGE } from "@/shared/constants/common.constants";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import {
  COMMENT_MANAGE_DEFAULT_FILTERS,
  COMMENT_MANAGE_TAB_VALUES,
} from "../../constants/comment-manage.constants";
import { useCommentModeration } from "../../hooks/use-comment-moderation";
import {
  useMutationUpdateCommentsStatus,
  useQueryCommentManageCourses,
  useQueryCommentsManage,
} from "../../services";
import {
  getCommentStatusForTab,
  toCommentManageRow,
} from "../../utils/comment-manage.utils";
import { CommentManageView } from "./components";

export interface CommentManagePageProps {}

export function CommentManagePage(_props: CommentManagePageProps) {
  const [filters, setFilters] = useQueryStates({
    search: parseAsString.withDefault(COMMENT_MANAGE_DEFAULT_FILTERS.search),
    tab: parseAsStringLiteral(COMMENT_MANAGE_TAB_VALUES).withDefault(
      COMMENT_MANAGE_DEFAULT_FILTERS.tab,
    ),
    courseId: parseAsString.withDefault(
      COMMENT_MANAGE_DEFAULT_FILTERS.courseId,
    ),
    page: parseAsInteger.withDefault(COMMENT_MANAGE_DEFAULT_FILTERS.page),
  });
  const { userInfo } = useUserContext();
  const userId = userInfo?.clerkId;

  const { data, isPending, isPlaceholderData, isFetching, refetch } =
    useQueryCommentsManage({
      userId,
      search: filters.search,
      status: getCommentStatusForTab(filters.tab),
      courseId: filters.courseId,
      page: filters.page,
      limit: ITEMS_PER_PAGE,
    });
  const { data: courses } = useQueryCommentManageCourses(userId);
  const { mutateAsync: updateCommentsStatusAsync } =
    useMutationUpdateCommentsStatus();

  // fetchCommentsManage trả undefined khi lỗi hoặc không phải admin, expert
  const result = data && {
    comments: data.comments.map(toCommentManageRow),
    total: data.total,
    tabCounts: data.tabCounts,
  };

  const moderation = useCommentModeration({
    changeStatus: (commentIds, status) =>
      updateCommentsStatusAsync({ commentIds, status }),
  });

  return (
    <CommentManageView
      filters={filters}
      onFiltersChange={setFilters}
      result={result}
      courses={courses || []}
      pageSize={ITEMS_PER_PAGE}
      isLoading={isPending}
      isError={!isPending && !data}
      isRefreshing={isPlaceholderData && isFetching}
      onRetry={refetch}
      selectedIds={moderation.selectedIds}
      pendingChange={moderation.pendingChange}
      onToggleSelect={moderation.handleToggleSelect}
      onToggleSelectAll={moderation.handleToggleSelectAll}
      onClearSelection={moderation.handleClearSelection}
      onChangeStatus={moderation.handleChangeStatus}
    />
  );
}
