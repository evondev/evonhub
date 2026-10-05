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
import {
  useModeration,
  usePurgeRejected,
  useQueryManagedCourses,
} from "@/shared/hooks";
import {
  useMutationDeleteRejectedComments,
  useMutationUpdateCommentsStatus,
  useMutationUpdateMatchingComments,
  useQueryCommentsManage,
} from "../../services";
import { CommentManageRow } from "../../types/comment-manage.types";
import {
  buildCommentCountSuccessMessage,
  buildCommentPurgeSuccessMessage,
  buildCommentSuccessMessage,
  getCommentStatusForAction,
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
  const { data: courses } = useQueryManagedCourses(userId);
  const { mutateAsync: updateCommentsStatusAsync } =
    useMutationUpdateCommentsStatus();
  const { mutateAsync: updateMatchingCommentsAsync } =
    useMutationUpdateMatchingComments();
  const { mutateAsync: deleteRejectedCommentsAsync } =
    useMutationDeleteRejectedComments();
  // Thao tác "tất cả" áp đúng phạm vi đang xem: từ khoá và khoá học
  const scope = { search: filters.search, courseId: filters.courseId };

  // fetchCommentsManage trả undefined khi lỗi hoặc không phải admin, expert
  const result = data && {
    comments: data.comments.map(toCommentManageRow),
    total: data.total,
    tabCounts: data.tabCounts,
  };

  const moderation = useModeration<CommentManageRow>({
    changeStatus: (commentIds, action) =>
      updateCommentsStatusAsync({
        commentIds,
        status: getCommentStatusForAction(action),
      }),
    changeMatchingStatus: (excludedIds, action) =>
      updateMatchingCommentsAsync({
        scope,
        currentStatus: getCommentStatusForTab(filters.tab),
        excludedIds,
        status: getCommentStatusForAction(action),
      }),
    buildSuccessMessage: buildCommentSuccessMessage,
    buildCountSuccessMessage: buildCommentCountSuccessMessage,
  });
  const purge = usePurgeRejected({
    purge: () => deleteRejectedCommentsAsync(scope),
    buildSuccessMessage: buildCommentPurgeSuccessMessage,
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
      moderation={moderation}
      purge={purge}
    />
  );
}
