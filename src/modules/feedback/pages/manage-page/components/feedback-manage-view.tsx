"use client";

import { LoadErrorState, SearchInput } from "@/shared/components/common";
import { useRef } from "react";
import { FEEDBACK_MANAGE_DEFAULT_FILTERS } from "../../../constants";
import {
  FeedbackManageFilters,
  FeedbackManageResult,
  FeedbackRow,
} from "../../../types";
import { FeedbackList } from "./feedback-list";
import { FeedbackListSkeleton } from "./feedback-list-skeleton";

export interface FeedbackManageViewProps {
  filters: FeedbackManageFilters;
  onFiltersChange: (changes: Partial<FeedbackManageFilters>) => void;
  result?: FeedbackManageResult;
  pageSize: number;
  isLoading: boolean;
  isError: boolean;
  /** Đã có dòng trên màn, đang tải trang/từ khoá mới */
  isRefreshing: boolean;
  onRetry: () => void;
  onDelete: (feedback: FeedbackRow) => void;
}

export function FeedbackManageView({
  filters,
  onFiltersChange,
  result,
  pageSize,
  isLoading,
  isError,
  isRefreshing,
  onRetry,
  onDelete,
}: FeedbackManageViewProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  function handleSearch(search: string) {
    if (search === filters.search) return;

    onFiltersChange({ search, page: 1 });
  }

  function handlePageChange(page: number) {
    onFiltersChange({ page });
    window.scrollTo({ top: 0 });
  }

  function handleClearSearch() {
    onFiltersChange({ ...FEEDBACK_MANAGE_DEFAULT_FILTERS });
    searchInputRef.current?.focus();
  }

  return (
    <div className="flex flex-col gap-4">
      <SearchInput
        ref={searchInputRef}
        value={filters.search}
        onSearch={handleSearch}
        placeholder="Tìm nội dung, tên, email"
        label="Tìm góp ý"
        className="w-full sm:w-80"
      />
      {isLoading && <FeedbackListSkeleton />}
      {!isLoading && isError && (
        <LoadErrorState title="Chưa tải được góp ý" onRetry={onRetry} />
      )}
      {!isLoading && !isError && result && (
        <FeedbackList
          result={result}
          filters={filters}
          pageSize={pageSize}
          isRefreshing={isRefreshing}
          onPageChange={handlePageChange}
          onClearSearch={handleClearSearch}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}
