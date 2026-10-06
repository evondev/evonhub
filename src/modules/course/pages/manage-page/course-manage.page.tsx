"use client";

import { ITEMS_PER_PAGE } from "@/shared/constants/common.constants";
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import { COURSE_MANAGE_TAB_VALUES } from "../../constants/course-manage.constants";
import { useQueryCoursesManage } from "../../services";
import {
  getCourseManageStatus,
  toCourseManageRow,
} from "../../utils/course-manage.utils";
import { CourseManageView } from "./components";

export interface CourseManagePageProps {}

export function CourseManagePage(_props: CourseManagePageProps) {
  const [filters, setFilters] = useQueryStates({
    search: parseAsString.withDefault(""),
    tab: parseAsStringLiteral(COURSE_MANAGE_TAB_VALUES).withDefault("all"),
    isFree: parseAsBoolean.withDefault(false),
    page: parseAsInteger.withDefault(1),
  });

  const { data, isPending, isPlaceholderData, isFetching, refetch } =
    useQueryCoursesManage({
      search: filters.search,
      page: filters.page,
      limit: ITEMS_PER_PAGE,
      isFree: filters.isFree,
      status: getCourseManageStatus(filters.tab),
    });

  // fetchCoursesManage trả undefined khi lỗi hoặc không phải admin, expert
  const result = data && {
    courses: data.courses.map(toCourseManageRow),
    total: data.total,
    tabCounts: data.tabCounts,
  };

  return (
    <CourseManageView
      filters={filters}
      onFiltersChange={setFilters}
      result={result}
      pageSize={ITEMS_PER_PAGE}
      isLoading={isPending}
      isError={!isPending && !data}
      isRefreshing={isPlaceholderData && isFetching}
      onRetry={refetch}
    />
  );
}
