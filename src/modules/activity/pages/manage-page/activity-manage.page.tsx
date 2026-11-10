"use client";

import { useUserContext } from "@/components/user-context";
import { ITEMS_PER_PAGE } from "@/shared/constants/common.constants";
import { useQueryManagedCourses } from "@/shared/hooks";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import {
  ACTIVITY_MANAGE_DEFAULT_FILTERS,
  ACTIVITY_MANAGE_TAB_VALUES,
} from "../../constants";
import { useQueryActivities, useQueryTopLessons } from "../../services";
import { buildActivityManageResult, isTopLessonsTab } from "../../utils";
import { ActivityManageView } from "./components";

export interface ActivityManagePageProps {}

export function ActivityManagePage(_props: ActivityManagePageProps) {
  const [filters, setFilters] = useQueryStates({
    search: parseAsString.withDefault(ACTIVITY_MANAGE_DEFAULT_FILTERS.search),
    tab: parseAsStringLiteral(ACTIVITY_MANAGE_TAB_VALUES).withDefault(
      ACTIVITY_MANAGE_DEFAULT_FILTERS.tab,
    ),
    courseId: parseAsString.withDefault(
      ACTIVITY_MANAGE_DEFAULT_FILTERS.courseId,
    ),
    from: parseAsString.withDefault(ACTIVITY_MANAGE_DEFAULT_FILTERS.from),
    to: parseAsString.withDefault(ACTIVITY_MANAGE_DEFAULT_FILTERS.to),
    page: parseAsInteger.withDefault(ACTIVITY_MANAGE_DEFAULT_FILTERS.page),
  });
  const { userInfo } = useUserContext();

  const isTopLessonsView = isTopLessonsTab(filters.tab);
  const sharedParams = {
    search: filters.search,
    courseId: filters.courseId,
    from: filters.from,
    to: filters.to,
    page: filters.page,
    limit: ITEMS_PER_PAGE,
  };
  // Mỗi lúc chỉ chạy query của kiểu tab đang xem
  const activitiesQuery = useQueryActivities({
    ...sharedParams,
    tab: filters.tab,
    enabled: !isTopLessonsView,
  });
  const topLessonsQuery = useQueryTopLessons({
    ...sharedParams,
    enabled: isTopLessonsView,
  });
  const activeQuery = isTopLessonsView ? topLessonsQuery : activitiesQuery;
  const { data: courses } = useQueryManagedCourses(userInfo?.clerkId);

  // Hai action trả undefined khi lỗi hoặc không phải admin
  const result = buildActivityManageResult({
    isTopLessonsView,
    activitiesData: activitiesQuery.data,
    topLessonsData: topLessonsQuery.data,
  });

  return (
    <ActivityManageView
      filters={filters}
      onFiltersChange={setFilters}
      result={result}
      courses={courses || []}
      pageSize={ITEMS_PER_PAGE}
      isLoading={activeQuery.isPending}
      isError={!activeQuery.isPending && !activeQuery.data}
      isRefreshing={activeQuery.isPlaceholderData && activeQuery.isFetching}
      onRetry={activeQuery.refetch}
    />
  );
}
