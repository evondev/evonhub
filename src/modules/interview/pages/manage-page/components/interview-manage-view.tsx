"use client";

import { Button } from "@/components/ui/button";
import { ConfirmDialog, LoadErrorState } from "@/shared/components/common";
import { ModerationToolbar } from "@/shared/components/moderation";
import { CourseFilterOption } from "@/shared/types";
import { cn } from "@/shared/utils";
import { Plus, Sparkles, Trash2 } from "lucide-react";
import { useRef } from "react";
import { INTERVIEW_MANAGE_TABS } from "../../../constants";
import { useInterviewManage } from "../../../hooks/use-interview-manage";
import { InterviewAdminQuestion, InterviewManageFilters, InterviewTabCounts } from "../../../types";
import { AiGenerateDialog } from "./ai-generate-dialog";
import { QuestionEditor } from "./question-editor";
import { QuestionListEmpty } from "./question-list-empty";
import { QuestionListSkeleton } from "./question-list-skeleton";
import { QuestionQueue } from "./question-queue";

export interface InterviewManageViewProps {
  filters: InterviewManageFilters;
  onFiltersChange: (changes: Partial<InterviewManageFilters>) => void;
  courses: CourseFilterOption[];
  questions: InterviewAdminQuestion[];
  tabCounts?: InterviewTabCounts;
  isLoading: boolean;
  isError: boolean;
  /** Đã có câu trên màn, đang tải tab hay từ khoá mới */
  isRefreshing: boolean;
  onRetry: () => void;
  /** Trang xem trước mở sẵn hộp tạo bằng AI */
  isAiDialogInitiallyOpen?: boolean;
}

const QUESTION_LIST_ID = "interview-question-list";

export function InterviewManageView({
  filters,
  onFiltersChange,
  courses,
  questions,
  tabCounts,
  isLoading,
  isError,
  isRefreshing,
  onRetry,
  isAiDialogInitiallyOpen = false,
}: InterviewManageViewProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const manage = useInterviewManage({ filters, questions, onFiltersChange, isAiDialogInitiallyOpen });
  const tabs = INTERVIEW_MANAGE_TABS.map((tab) => ({ ...tab, count: tabCounts?.[tab.value] }));
  const activeTabLabel = INTERVIEW_MANAGE_TABS.find((tab) => tab.value === filters.tab)?.label || "";
  const editorTitle = manage.isCreating
    ? "Câu mới"
    : `Câu ${manage.selectedIndex + 1} / ${questions.length} ${activeTabLabel.toLowerCase()}`;
  const isEditorVisible = manage.isCreating || Boolean(manage.selectedQuestion);
  const hasContent = questions.length > 0 || manage.isCreating;

  function handleClearSearch() {
    onFiltersChange({ search: "" });
    searchInputRef.current?.focus();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold text-foreground">Câu hỏi phỏng vấn</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="h-11 px-3.5 sm:px-4 md:h-10" onClick={manage.startCreating}>
            <Plus className="size-4" />
            Thêm câu
          </Button>
          <Button variant="primary" className="h-11 px-3.5 sm:px-4 md:h-10" onClick={manage.openAiDialog}>
            <Sparkles className="size-4" />
            Tạo bằng AI
          </Button>
        </div>
      </div>
      <ModerationToolbar
        tabs={tabs}
        activeTab={filters.tab}
        search={filters.search}
        courses={courses}
        courseId={filters.courseId}
        searchPlaceholder="Tìm câu hỏi, tag"
        searchLabel="Tìm câu hỏi"
        onTabChange={(tab) => onFiltersChange({ tab })}
        onCourseChange={(courseId) => onFiltersChange({ courseId })}
        onSearch={(search) => onFiltersChange({ search })}
        searchInputRef={searchInputRef}
        controlsId={QUESTION_LIST_ID}
      />
      {isLoading && <QuestionListSkeleton />}
      {!isLoading && isError && <LoadErrorState title="Chưa tải được câu hỏi" onRetry={onRetry} />}
      {!isLoading && !isError && !hasContent && (
        <QuestionListEmpty
          isSearching={Boolean(filters.search)}
          onClearSearch={handleClearSearch}
          onCreate={manage.startCreating}
          onOpenAi={manage.openAiDialog}
        />
      )}
      {!isLoading && !isError && hasContent && (
        <div id={QUESTION_LIST_ID} className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:items-start">
          <div className={cn(manage.isEditorOpenOnMobile && "hidden lg:block")}>
            {questions.length > 0 && (
              <QuestionQueue
                title={activeTabLabel}
                questions={questions}
                selectedQuestionId={manage.selectedQuestion?.id || ""}
                isRefreshing={isRefreshing}
                onSelect={manage.selectQuestion}
              />
            )}
          </div>
          {isEditorVisible && (
            <div className={cn(!manage.isEditorOpenOnMobile && "hidden lg:block")}>
              <QuestionEditor
                key={manage.isCreating ? "new" : `${manage.selectedQuestion?.id}:${manage.selectedQuestion?.updatedAt}`}
                question={manage.selectedQuestion}
                courseId={filters.courseId}
                title={editorTitle}
                canGoPrevious={!manage.isCreating && manage.selectedIndex > 0}
                canGoNext={!manage.isCreating && manage.selectedIndex < questions.length - 1}
                isSaving={manage.isSaving}
                isRegenerating={manage.isRegenerating}
                isUnpublishing={manage.isUnpublishing}
                onPrevious={() => manage.goToOffset(-1)}
                onNext={() => manage.goToOffset(1)}
                onBack={manage.closeEditorOnMobile}
                onSave={manage.saveQuestion}
                onDelete={manage.requestDelete}
                onRegenerate={manage.regenerateQuestion}
                onUnpublish={manage.unpublishQuestion}
              />
            </div>
          )}
        </div>
      )}
      {manage.isAiDialogOpen && (
        <AiGenerateDialog
          isOpen={manage.isAiDialogOpen}
          courses={courses}
          defaultCourseId={filters.courseId}
          isGenerating={manage.isGenerating}
          onGenerate={manage.generateQuestions}
          onClose={manage.closeAiDialog}
        />
      )}
      <ConfirmDialog
        isOpen={Boolean(manage.pendingDeleteQuestion)}
        icon={Trash2}
        title="Xoá câu hỏi này?"
        description="Mọi lượt làm và điểm của học viên ở câu này cũng bị xoá. Không hoàn tác được."
        confirmLabel="Xoá câu hỏi"
        isConfirming={manage.isDeleting}
        onConfirm={manage.confirmDelete}
        onCancel={manage.cancelDelete}
      />
    </div>
  );
}
