"use client";

import { ITEMS_PER_PAGE } from "@/shared/constants/common.constants";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useState } from "react";
import { toast } from "react-toastify";
import { FEEDBACK_MANAGE_DEFAULT_FILTERS } from "../../constants";
import { useMutationDeleteFeedback, useQueryFeedbacks } from "../../services";
import { FeedbackRow } from "../../types";
import { toFeedbackRow } from "../../utils";
import { FeedbackDeleteDialog, FeedbackManageView } from "./components";

export function FeedbackManagePage() {
  const [filters, setFilters] = useQueryStates({
    search: parseAsString.withDefault(FEEDBACK_MANAGE_DEFAULT_FILTERS.search),
    page: parseAsInteger.withDefault(FEEDBACK_MANAGE_DEFAULT_FILTERS.page),
  });
  const [pendingFeedback, setPendingFeedback] = useState<FeedbackRow | null>(
    null,
  );

  const { data, isPending, isPlaceholderData, isFetching, refetch } =
    useQueryFeedbacks({
      search: filters.search,
      page: filters.page,
      limit: ITEMS_PER_PAGE,
    });
  const deleteFeedbackMutation = useMutationDeleteFeedback();

  // fetchFeedbacks trả undefined khi lỗi hoặc không phải admin
  const result = data && {
    feedbacks: data.feedbacks.map(toFeedbackRow),
    total: data.total,
  };

  async function handleConfirmDelete() {
    if (!pendingFeedback) return;

    const deleteResult = await deleteFeedbackMutation.mutateAsync(
      pendingFeedback.id,
    );

    if (!deleteResult.isSuccess) {
      toast.error("Chưa xoá được góp ý, thử lại sau nhé");
      return;
    }

    toast.success("Đã xoá góp ý");
    setPendingFeedback(null);
  }

  return (
    <>
      <FeedbackManageView
        filters={filters}
        onFiltersChange={setFilters}
        result={result}
        pageSize={ITEMS_PER_PAGE}
        isLoading={isPending}
        isError={!isPending && !data}
        isRefreshing={isPlaceholderData && isFetching}
        onRetry={refetch}
        onDelete={setPendingFeedback}
      />
      <FeedbackDeleteDialog
        pendingFeedback={pendingFeedback}
        isDeleting={deleteFeedbackMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingFeedback(null)}
      />
    </>
  );
}
