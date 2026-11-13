"use client";

import { PreviewStateSwitcher } from "@/shared/components/common";
import { useState } from "react";
import { INTERVIEW_MANAGE_DEFAULT_FILTERS } from "../../constants";
import {
  PREVIEW_INTERVIEW_ADMIN_QUESTIONS,
  PREVIEW_INTERVIEW_COURSES,
  PREVIEW_INTERVIEW_MANAGE_STATE_LINKS,
} from "../../constants/interview-preview.constants";
import { InterviewManageFilters } from "../../types";
import { InterviewManageView } from "../manage-page/components/interview-manage-view";

interface InterviewManagePreviewPageProps {
  state: string;
}

const previewCourses = PREVIEW_INTERVIEW_COURSES.map((course) => ({ id: course.id, title: course.title }));

/**
 * Xem trước trang Admin bằng câu giả. Lọc tab, tìm tại chỗ; bấm Lưu, Đăng, Tạo
 * bằng AI vẫn gọi server nên sẽ báo không có quyền. Route chỉ mở ở dev
 */
export function InterviewManagePreviewPage({ state }: InterviewManagePreviewPageProps) {
  const [filters, setFilters] = useState<InterviewManageFilters>({
    ...INTERVIEW_MANAGE_DEFAULT_FILTERS,
    courseId: previewCourses[0].id,
  });
  const keyword = filters.search.trim().toLowerCase();
  const visibleQuestions = PREVIEW_INTERVIEW_ADMIN_QUESTIONS.filter(
    (question) =>
      (filters.tab === "all" || question.status === filters.tab) &&
      (!keyword || question.prompt.toLowerCase().includes(keyword)),
  );
  const draftCount = PREVIEW_INTERVIEW_ADMIN_QUESTIONS.filter((question) => question.status === "draft").length;

  return (
    <div className="flex flex-col gap-4">
      <PreviewStateSwitcher links={PREVIEW_INTERVIEW_MANAGE_STATE_LINKS} currentState={state} />
      <InterviewManageView
        filters={filters}
        onFiltersChange={(changes) => setFilters((currentFilters) => ({ ...currentFilters, ...changes }))}
        courses={previewCourses}
        questions={state === "rong" ? [] : visibleQuestions}
        tabCounts={{
          draft: state === "rong" ? 0 : draftCount,
          published: state === "rong" ? 0 : PREVIEW_INTERVIEW_ADMIN_QUESTIONS.length - draftCount,
          all: state === "rong" ? 0 : PREVIEW_INTERVIEW_ADMIN_QUESTIONS.length,
        }}
        isLoading={state === "dang-tai"}
        isError={state === "loi"}
        isRefreshing={false}
        onRetry={() => undefined}
        isAiDialogInitiallyOpen={state === "tao-ai"}
      />
    </div>
  );
}
