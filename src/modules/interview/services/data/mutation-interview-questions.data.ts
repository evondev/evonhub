import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { invalidateQueriesByKeys } from "@/shared/helpers/query-helper";
import { useMutation } from "@tanstack/react-query";
import {
  deleteInterviewQuestion,
  generateInterviewQuestions,
  regenerateInterviewQuestion,
  saveInterviewQuestion,
  unpublishInterviewQuestion,
} from "../../actions";
import { InterviewActionResult } from "../../types";

function invalidateQuestionsOnSuccess(result: InterviewActionResult) {
  if (result.isSuccess) invalidateQueriesByKeys(QUERY_KEYS.GET_INTERVIEW_QUESTIONS);
}

export function useMutationSaveInterviewQuestion() {
  return useMutation({
    mutationFn: saveInterviewQuestion,
    mutationKey: [QUERY_KEYS.HANDLE_SAVE_INTERVIEW_QUESTION],
    onSuccess: invalidateQuestionsOnSuccess,
  });
}

export function useMutationDeleteInterviewQuestion() {
  return useMutation({
    mutationFn: deleteInterviewQuestion,
    mutationKey: [QUERY_KEYS.HANDLE_DELETE_INTERVIEW_QUESTION],
    onSuccess: invalidateQuestionsOnSuccess,
  });
}

export function useMutationUnpublishInterviewQuestion() {
  return useMutation({
    mutationFn: unpublishInterviewQuestion,
    mutationKey: [QUERY_KEYS.HANDLE_UNPUBLISH_INTERVIEW_QUESTION],
    onSuccess: invalidateQuestionsOnSuccess,
  });
}

export function useMutationGenerateInterviewQuestions() {
  return useMutation({
    mutationFn: generateInterviewQuestions,
    mutationKey: [QUERY_KEYS.HANDLE_GENERATE_INTERVIEW_QUESTIONS],
    onSuccess: invalidateQuestionsOnSuccess,
  });
}

export function useMutationRegenerateInterviewQuestion() {
  return useMutation({
    mutationFn: regenerateInterviewQuestion,
    mutationKey: [QUERY_KEYS.HANDLE_REGENERATE_INTERVIEW_QUESTION],
    onSuccess: invalidateQuestionsOnSuccess,
  });
}
