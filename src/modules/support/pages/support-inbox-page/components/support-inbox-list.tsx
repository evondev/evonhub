"use client";

import { FilterTabs } from "@/shared/components/common/filter-tabs";
import { LoadErrorState } from "@/shared/components/common/load-error-state";
import { Spinner } from "@/shared/components/common/spinner";
import { SupportInbox, SupportInboxFilter } from "../../../types";
import { buildSupportInboxTabs } from "../../../utils";
import { SupportInboxItem } from "./support-inbox-item";

interface SupportInboxListProps {
  inbox: SupportInbox | undefined;
  filter: SupportInboxFilter;
  selectedConversationId: string;
  isLoading: boolean;
  onFilterChange: (filter: SupportInboxFilter) => void;
  onSelect: (conversationId: string) => void;
  onRetry: () => void;
}

const SUPPORT_INBOX_LIST_ID = "support-inbox-list";

/** Cột hộp thư: tab Tất cả / Chưa đọc trên danh sách hội thoại */
export function SupportInboxList({
  inbox,
  filter,
  selectedConversationId,
  isLoading,
  onFilterChange,
  onSelect,
  onRetry,
}: SupportInboxListProps) {
  const isEmpty = inbox?.conversations.length === 0;
  const emptyMessage =
    filter === "unread"
      ? "Đã đọc hết tin nhắn"
      : "Chưa có học viên nào nhắn tin";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-border px-3 pt-2">
        <FilterTabs
          tabs={buildSupportInboxTabs(inbox?.unreadCount)}
          activeValue={filter}
          onChange={onFilterChange}
          controlsId={SUPPORT_INBOX_LIST_ID}
        />
      </div>
      <div
        id={SUPPORT_INBOX_LIST_ID}
        className="min-h-0 flex-1 overflow-y-auto p-2"
      >
        {isLoading && <Spinner />}
        {!isLoading && !inbox && (
          <LoadErrorState
            title="Chưa tải được hộp thư"
            onRetry={onRetry}
            className="border-0"
          />
        )}
        {isEmpty && (
          <p className="px-3 py-10 text-center text-sm text-muted">
            {emptyMessage}
          </p>
        )}
        {inbox && !isEmpty && (
          <ul aria-label="Hội thoại" className="flex flex-col gap-0.5">
            {inbox.conversations.map((conversation) => (
              <SupportInboxItem
                key={conversation.id}
                conversation={conversation}
                isSelected={conversation.id === selectedConversationId}
                onSelect={onSelect}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
