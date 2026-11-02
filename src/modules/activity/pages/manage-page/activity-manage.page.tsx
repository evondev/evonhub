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
import { useQueryActivities } from "../../services";
import { toActivityRow } from "../../utils";
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
    page: parseAsInteger.withDefault(ACTIVITY_MANAGE_DEFAULT_FILTERS.page),
  });
  const { userInfo } = useUserContext();

  const { data, isPending, isPlaceholderData, isFetching, refetch } =
    useQueryActivities({
      search: filters.search,
      tab: filters.tab,
      courseId: filters.courseId,
      page: filters.page,
      limit: ITEMS_PER_PAGE,
    });
  const { data: courses } = useQueryManagedCourses(userInfo?.clerkId);

  // fetchActivities trả undefined khi lỗi hoặc không phải admin
  const result = data && {
    activities: data.activities.map(toActivityRow),
    total: data.total,
    tabCounts: data.tabCounts,
  };

  return (
    <ActivityManageView
      filters={filters}
      onFiltersChange={setFilters}
      result={result}
      courses={courses || []}
      pageSize={ITEMS_PER_PAGE}
      isLoading={isPending}
      isError={!isPending && !data}
      isRefreshing={isPlaceholderData && isFetching}
      onRetry={refetch}
    />
  );
}
