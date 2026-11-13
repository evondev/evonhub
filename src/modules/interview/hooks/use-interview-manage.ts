"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { InterviewQuestionStatus } from "../constants/interview-enums";
import {
  useMutationDeleteInterviewQuestion,
  useMutationGenerateInterviewQuestions,
  useMutationRegenerateInterviewQuestion,
  useMutationSaveInterviewQuestion,
  useMutationUnpublishInterviewQuestion,
} from "../services";
import {
  GenerateInterviewQuestionsInput,
  InterviewAdminQuestion,
  InterviewManageFilters,
  InterviewQuestionFormValues,
} from "../types";

interface UseInterviewManageParams {
  filters: InterviewManageFilters;
  questions: InterviewAdminQuestion[];
  onFiltersChange: (changes: Partial<InterviewManageFilters>) => void;
  /** Trang xem trước mở sẵn hộp tạo bằng AI */
  isAiDialogInitiallyOpen?: boolean;
}

interface SelectionState {
  selectedQuestionId: string;
  isCreating: boolean;
  /** Màn hẹp chỉ hiện một trong hai: danh sách hoặc khung soạn */
  isEditorOpenOnMobile: boolean;
}

/** Chọn câu, soạn, lưu, đăng, xoá, tạo bằng AI ở trang Admin */
export function useInterviewManage({
  filters,
  questions,
  onFiltersChange,
  isAiDialogInitiallyOpen = false,
}: UseInterviewManageParams) {
  const [selection, setSelection] = useState<SelectionState>({
    selectedQuestionId: "",
    isCreating: false,
    isEditorOpenOnMobile: false,
  });
  const [pendingDeleteQuestion, setPendingDeleteQuestion] = useState<InterviewAdminQuestion | null>(null);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(isAiDialogInitiallyOpen);
  const saveMutation = useMutationSaveInterviewQuestion();
  const deleteMutation = useMutationDeleteInterviewQuestion();
  const unpublishMutation = useMutationUnpublishInterviewQuestion();
  const generateMutation = useMutationGenerateInterviewQuestions();
  const regenerateMutation = useMutationRegenerateInterviewQuestion();

  // Chưa chọn câu nào (hay câu đã chọn rời khỏi tab) thì mở câu đầu danh sách
  const selectedIndex = Math.max(
    questions.findIndex((question) => question.id === selection.selectedQuestionId),
    0,
  );
  const selectedQuestion = selection.isCreating ? undefined : questions[selectedIndex];

  /** Câu kế tiếp sau khi câu đang chọn rời danh sách (đăng ở tab Chờ duyệt, xoá) */
  function findNextQuestionId() {
    return questions[selectedIndex + 1]?.id || questions[selectedIndex - 1]?.id || "";
  }

  function selectQuestion(questionId: string) {
    setSelection({ selectedQuestionId: questionId, isCreating: false, isEditorOpenOnMobile: true });
  }

  function goToOffset(offset: number) {
    const targetQuestion = questions[selectedIndex + offset];

    if (targetQuestion) selectQuestion(targetQuestion.id);
  }

  function startCreating() {
    if (!filters.courseId) {
      toast.info("Chọn khóa ở bộ lọc trước khi thêm câu");
      return;
    }

    setSelection({ selectedQuestionId: "", isCreating: true, isEditorOpenOnMobile: true });
  }

  function closeEditorOnMobile() {
    setSelection((currentSelection) => ({ ...currentSelection, isCreating: false, isEditorOpenOnMobile: false }));
  }

  async function saveQuestion(values: InterviewQuestionFormValues, shouldPublish: boolean) {
    const nextQuestionId = findNextQuestionId();
    const result = await saveMutation.mutateAsync({
      questionId: selectedQuestion?.id,
      values,
      shouldPublish,
    });

    if (!result.isSuccess || !result.question) {
      toast.error(result.message || "Chưa lưu được, thử lại sau nhé");
      return;
    }

    toast.success(shouldPublish ? "Đã đăng câu hỏi" : "Đã lưu");

    // Đăng ở tab Chờ duyệt thì câu rời danh sách: sang luôn câu chờ duyệt kế tiếp
    const isLeavingDraftTab = shouldPublish && filters.tab === InterviewQuestionStatus.Draft;
    const nextSelectedId = isLeavingDraftTab && !selection.isCreating ? nextQuestionId : result.question.id;

    setSelection({ selectedQuestionId: nextSelectedId, isCreating: false, isEditorOpenOnMobile: true });
  }

  async function confirmDelete() {
    if (!pendingDeleteQuestion) return;

    const nextQuestionId = findNextQuestionId();
    const result = await deleteMutation.mutateAsync(pendingDeleteQuestion.id);

    if (!result.isSuccess) {
      toast.error("Chưa xoá được câu hỏi, thử lại sau nhé");
      return;
    }

    toast.success("Đã xoá câu hỏi");
    setPendingDeleteQuestion(null);
    setSelection((currentSelection) => ({ ...currentSelection, selectedQuestionId: nextQuestionId }));
  }

  async function unpublishQuestion() {
    if (!selectedQuestion) return;

    const result = await unpublishMutation.mutateAsync(selectedQuestion.id);

    if (!result.isSuccess) {
      toast.error("Chưa gỡ đăng được, thử lại sau nhé");
      return;
    }

    toast.success("Đã gỡ đăng, câu về Chờ duyệt");
  }

  async function regenerateQuestion() {
    if (!selectedQuestion) return;

    const result = await regenerateMutation.mutateAsync(selectedQuestion.id);

    if (!result.isSuccess) {
      toast.error(result.message || "AI chưa trả lời được, thử lại sau nhé");
      return;
    }

    toast.success("AI đã viết lại câu này, đọc lại trước khi đăng nhé");
  }

  async function generateQuestions(input: GenerateInterviewQuestionsInput) {
    const result = await generateMutation.mutateAsync(input);

    if (!result.isSuccess) {
      toast.error(result.message || "AI chưa trả lời được, thử lại sau nhé");
      return;
    }

    const skippedNote = result.skippedCount ? `, bỏ ${result.skippedCount} câu không đạt` : "";

    toast.success(`Đã tạo ${result.createdCount} câu nháp${skippedNote}`);
    setIsAiDialogOpen(false);
    setSelection({ selectedQuestionId: "", isCreating: false, isEditorOpenOnMobile: false });
    onFiltersChange({ courseId: input.courseId, tab: InterviewQuestionStatus.Draft, search: "" });
  }

  return {
    selectedQuestion,
    selectedIndex,
    isCreating: selection.isCreating,
    isEditorOpenOnMobile: selection.isEditorOpenOnMobile,
    pendingDeleteQuestion,
    isAiDialogOpen,
    isSaving: saveMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isUnpublishing: unpublishMutation.isPending,
    isGenerating: generateMutation.isPending,
    isRegenerating: regenerateMutation.isPending,
    selectQuestion,
    goToOffset,
    startCreating,
    closeEditorOnMobile,
    saveQuestion,
    requestDelete: () => setPendingDeleteQuestion(selectedQuestion || null),
    cancelDelete: () => setPendingDeleteQuestion(null),
    confirmDelete,
    unpublishQuestion,
    regenerateQuestion,
    openAiDialog: () => setIsAiDialogOpen(true),
    closeAiDialog: () => setIsAiDialogOpen(false),
    generateQuestions,
  };
}
