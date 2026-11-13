"use client";

import { useUserContext } from "@/components/user-context";
import { useQueryManagedCourses } from "@/shared/hooks";
import { parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { INTERVIEW_MANAGE_DEFAULT_FILTERS, INTERVIEW_MANAGE_TAB_VALUES } from "../../constants";
import { useQueryInterviewQuestions } from "../../services";
import { InterviewManageView } from "./components/interview-manage-view";

export function InterviewManagePage() {
  const [filters, setFilters] = useQueryStates({
    courseId: parseAsString.withDefault(INTERVIEW_MANAGE_DEFAULT_FILTERS.courseId),
    tab: parseAsStringLiteral(INTERVIEW_MANAGE_TAB_VALUES).withDefault(INTERVIEW_MANAGE_DEFAULT_FILTERS.tab),
    search: parseAsString.withDefault(INTERVIEW_MANAGE_DEFAULT_FILTERS.search),
  });
  const { userInfo } = useUserContext();
  const { data: courses } = useQueryManagedCourses(userInfo?.clerkId);
  const { data, isPending, isPlaceholderData, isFetching, refetch } = useQueryInterviewQuestions(filters);

  return (
    <InterviewManageView
      filters={filters}
      onFiltersChange={setFilters}
      courses={courses || []}
      questions={data?.questions || []}
      tabCounts={data?.tabCounts}
      isLoading={isPending}
      // fetchInterviewQuestions trả undefined khi lỗi hoặc không phải Admin
      isError={!isPending && !data}
      isRefreshing={isPlaceholderData && isFetching}
      onRetry={refetch}
    />
  );
}
