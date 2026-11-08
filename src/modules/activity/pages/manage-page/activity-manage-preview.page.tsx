"use client";

import { PreviewStateSwitcher } from "@/shared/components/common";
import { ITEMS_PER_PAGE } from "@/shared/constants/common.constants";
import { useState } from "react";
import { ACTIVITY_MANAGE_DEFAULT_FILTERS } from "../../constants";
import {
  ACTIVITY_MANAGE_PREVIEW_ALL_COUNT,
  ACTIVITY_MANAGE_PREVIEW_EMPTY_KEYWORD,
  ACTIVITY_MANAGE_PREVIEW_STATE_LINKS,
  PREVIEW_ACTIVITIES,
  PREVIEW_ACTIVITY_COURSES,
} from "../../constants/activity-manage-preview.constants";
import { ActivityManageFilters, ActivityManagePreviewState } from "../../types";
import { countPreviewActivityTabs, filterPreviewActivities } from "../../utils";
import { ActivityManageView } from "./components";

interface ActivityManagePreviewPageProps {
  state: ActivityManagePreviewState;
}

const previewCourseTitleById = Object.fromEntries(
  PREVIEW_ACTIVITY_COURSES.map((course) => [course.id, course.title]),
);

/** Trang xem trước "Hoạt động" bằng nhật ký giả. Không đọc DB, chỉ mở ở dev */
export function ActivityManagePreviewPage({
  state,
}: ActivityManagePreviewPageProps) {
  const [filters, setFilters] = useState<ActivityManageFilters>({
    ...ACTIVITY_MANAGE_DEFAULT_FILTERS,
    search: state === "rong" ? ACTIVITY_MANAGE_PREVIEW_EMPTY_KEYWORD : "",
  });

  const matchedActivities = filterPreviewActivities(
    PREVIEW_ACTIVITIES,
    filters,
    previewCourseTitleById,
  );
  const previewTabCounts = countPreviewActivityTabs(
    PREVIEW_ACTIVITIES,
    filters,
    previewCourseTitleById,
  );
  // Chưa tìm, chưa lọc thì giả như đang xem cả nhật ký thật, để thấy phân trang
  const hasNarrowingFilters = Boolean(
    filters.search || filters.courseId || filters.from || filters.to,
  );
  const tabCounts = {
    ...previewTabCounts,
    all: hasNarrowingFilters
      ? previewTabCounts.all
      : ACTIVITY_MANAGE_PREVIEW_ALL_COUNT,
  };

  function handleFiltersChange(changes: Partial<ActivityManageFilters>) {
    setFilters((currentFilters) => ({ ...currentFilters, ...changes }));
  }

  function handleRetry() {}

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <PreviewStateSwitcher
        links={ACTIVITY_MANAGE_PREVIEW_STATE_LINKS}
        currentState={state}
      />
      <ActivityManageView
        filters={filters}
        onFiltersChange={handleFiltersChange}
        result={{
          activities: matchedActivities.slice(
            (filters.page - 1) * ITEMS_PER_PAGE,
            filters.page * ITEMS_PER_PAGE,
          ),
          total: tabCounts[filters.tab],
          tabCounts,
        }}
        courses={PREVIEW_ACTIVITY_COURSES}
        pageSize={ITEMS_PER_PAGE}
        isLoading={state === "dang-tai"}
        isError={state === "loi"}
        isRefreshing={false}
        onRetry={handleRetry}
      />
    </div>
  );
}
